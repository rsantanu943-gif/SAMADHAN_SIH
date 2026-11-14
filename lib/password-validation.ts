export interface PasswordRequirementCheck {
  id: "minLength" | "hasLetter" | "hasNumber" | "hasSpecial" | "noSpaces";
  label: string;
  met: boolean;
}

export type PasswordStrength = "empty" | "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthMetrics {
  score: 0 | 1 | 2 | 3 | 4;
  tier: PasswordStrength;
  label: string;
  percentage: number;
  entropyBits: number;
  charClasses: number;
  detectedPatterns: string[];
  feedback: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  strengthMetrics: PasswordStrengthMetrics;
  helperText: string;
  metCount: number;
  totalRequired: number;
  checks: PasswordRequirementCheck[];
}

export const MIN_PASSWORD_LENGTH = 8;

const COMMON_DICTIONARY_WORDS = [
  "password",
  "passw0rd",
  "qwerty",
  "admin",
  "welcome",
  "letmein",
  "iloveyou",
  "monkey",
  "dragon",
  "football",
  "default",
  "changeme",
];

const KEYBOARD_SEQUENCES = ["qwerty", "asdf", "zxcv", "qazwsx", "1qaz", "2wsx"];

function hasSequentialChars(str: string, minRun: number = 3): boolean {
  const lower = str.toLowerCase();
  let ascRun = 1;
  let descRun = 1;

  for (let i = 1; i < lower.length; i++) {
    const prev = lower.charCodeAt(i - 1);
    const curr = lower.charCodeAt(i);
    const isAlphaNum = /[a-z0-9]/.test(lower[i]) && /[a-z0-9]/.test(lower[i - 1]);

    if (isAlphaNum && curr === prev + 1) {
      ascRun++;
      descRun = 1;
    } else if (isAlphaNum && curr === prev - 1) {
      descRun++;
      ascRun = 1;
    } else {
      ascRun = 1;
      descRun = 1;
    }

    if (ascRun >= minRun || descRun >= minRun) {
      return true;
    }
  }
  return false;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthMetrics {
  if (password.length === 0) {
    return {
      score: 0,
      tier: "empty",
      label: "Empty",
      percentage: 0,
      entropyBits: 0,
      charClasses: 0,
      detectedPatterns: [],
      feedback: "Enter a password to evaluate entropy, complexity, and pattern resilience.",
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9\s]/.test(password);

  let poolSize = 0;
  let charClasses = 0;
  if (hasLower) {
    poolSize += 26;
    charClasses++;
  }
  if (hasUpper) {
    poolSize += 26;
    charClasses++;
  }
  if (hasNumber) {
    poolSize += 10;
    charClasses++;
  }
  if (hasSpecial) {
    poolSize += 32;
    charClasses++;
  }

  // Fallback for whitespace-only strings
  if (poolSize === 0) poolSize = 1;

  const uniqueChars = new Set(password).size;
  const uniquenessRatio = uniqueChars / password.length;
  // Blend raw length with uniqueness to penalize repetitive strings like "aaaaaaaa"
  const effectiveLength = password.length * (0.45 + 0.55 * uniquenessRatio);
  const rawEntropy = effectiveLength * Math.log2(poolSize);

  const detectedPatterns: string[] = [];
  const lower = password.toLowerCase();

  for (const word of COMMON_DICTIONARY_WORDS) {
    if (lower.includes(word)) {
      detectedPatterns.push(`Common word ("${word}")`);
      break;
    }
  }

  for (const seq of KEYBOARD_SEQUENCES) {
    if (lower.includes(seq)) {
      detectedPatterns.push(`Keyboard pattern ("${seq}")`);
      break;
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    detectedPatterns.push("Repeated characters (e.g. aaa, 111)");
  }

  if (hasSequentialChars(password, 4)) {
    detectedPatterns.push("Sequential run (e.g. 1234, abcd)");
  }

  if (/^\d+$/.test(password)) {
    detectedPatterns.push("Digits-only credential");
  } else if (/^[a-zA-Z]+$/.test(password)) {
    detectedPatterns.push("Letters-only credential");
  }

  // Apply pattern entropy penalty
  const patternPenalty = Math.min(detectedPatterns.length * 14, 34);
  const entropyBits = Math.max(0, Math.round(rawEntropy - patternPenalty));

  let score: 0 | 1 | 2 | 3 | 4 = 1;
  if (password.length < MIN_PASSWORD_LENGTH || entropyBits < 32) {
    score = 1;
  } else if (entropyBits < 52 || charClasses < 2) {
    score = 2;
  } else if (entropyBits < 72 || charClasses < 3 || detectedPatterns.length > 0) {
    score = 3;
  } else {
    score = 4;
  }

  // Common single-pattern weak credentials shouldn't exceed Fair
  if (detectedPatterns.some((p) => p.startsWith("Common word") || p.startsWith("Keyboard pattern")) && score > 2) {
    score = 2;
  }

  const tierMap: Record<1 | 2 | 3 | 4, { tier: PasswordStrength; label: string; percentage: number }> = {
    1: { tier: "weak", label: "Weak", percentage: 25 },
    2: { tier: "fair", label: "Fair", percentage: 50 },
    3: { tier: "good", label: "Good", percentage: 75 },
    4: { tier: "strong", label: "Strong", percentage: 100 },
  };

  const { tier, label, percentage } = tierMap[score];

  let feedback = "";
  if (detectedPatterns.length > 0 && score <= 2) {
    feedback = `Vulnerable pattern detected: ${detectedPatterns[0]}. Avoid predictable sequences or common words.`;
  } else if (score === 1) {
    feedback = `Low entropy (${entropyBits} bits). Increase length and mix character classes.`;
  } else if (score === 2) {
    feedback = `Moderate complexity (${entropyBits} bits). Add ${hasUpper ? "symbols/numbers" : "uppercase letters or extra length"} for stronger protection.`;
  } else if (score === 3) {
    feedback = hasUpper
      ? `Good entropy (${entropyBits} bits) across ${charClasses} character classes. Add length for maximum resilience.`
      : `Good entropy (${entropyBits} bits). Adding uppercase letters elevates strength to Strong.`;
  } else {
    feedback = `High entropy (${entropyBits} bits) across ${charClasses} character classes with no common patterns detected.`;
  }

  return {
    score,
    tier,
    label,
    percentage,
    entropyBits,
    charClasses,
    detectedPatterns,
    feedback,
  };
}

export function validateLoginPassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= MIN_PASSWORD_LENGTH;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9\s]/.test(password);
  const noSpaces = !/\s/.test(password);

  const checks: PasswordRequirementCheck[] = [
    { id: "minLength", label: "8+ characters", met: hasMinLength },
    { id: "hasLetter", label: "Letter (A–Z / a–z)", met: hasLetter },
    { id: "hasNumber", label: "Number (0–9)", met: hasNumber },
    { id: "hasSpecial", label: "Symbol (@, #, !, ...)", met: hasSpecial },
  ];

  const coreChecksMet = checks.filter((c) => c.met).length;
  const strengthMetrics = evaluatePasswordStrength(password);

  if (password.length === 0) {
    return {
      isValid: false,
      strength: "empty",
      strengthMetrics,
      helperText:
        "Use at least 8 characters including letters, at least one number (0–9), and one special character (e.g. @, #, !).",
      metCount: 0,
      totalRequired: checks.length,
      checks,
    };
  }

  if (!noSpaces) {
    return {
      isValid: false,
      strength: "weak",
      strengthMetrics: {
        ...strengthMetrics,
        score: 1,
        tier: "weak",
        label: "Weak",
        percentage: 25,
      },
      helperText: "Password cannot contain spaces. Remove whitespace to meet statutory rules.",
      metCount: coreChecksMet,
      totalRequired: checks.length,
      checks: [...checks, { id: "noSpaces", label: "No spaces", met: false }],
    };
  }

  const missing: string[] = [];
  if (!hasMinLength) {
    const remaining = MIN_PASSWORD_LENGTH - password.length;
    missing.push(`at least ${remaining} more character${remaining === 1 ? "" : "s"} (min ${MIN_PASSWORD_LENGTH})`);
  }
  if (!hasLetter) missing.push("a letter (A–Z or a–z)");
  if (!hasNumber) missing.push("a number (0–9)");
  if (!hasSpecial) missing.push("a special character (e.g. @, #, !)");

  if (missing.length > 0) {
    return {
      isValid: false,
      strength: strengthMetrics.tier,
      strengthMetrics,
      helperText: `Missing requirement${missing.length > 1 ? "s" : ""}: add ${missing.join(", ")}.`,
      metCount: coreChecksMet,
      totalRequired: checks.length,
      checks,
    };
  }

  return {
    isValid: true,
    strength: strengthMetrics.tier,
    strengthMetrics,
    helperText: "Password meets all minimum length (8+ chars) and character requirements.",
    metCount: checks.length,
    totalRequired: checks.length,
    checks,
  };
}
