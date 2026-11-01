export type ValidationResult = string | undefined;

export function validateEmail(value: string): ValidationResult {
  const email = value.trim();
  if (!email) return 'Email wajib diisi.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return 'Masukkan alamat email dengan format yang valid.';
  }
  return undefined;
}

export function validateLoginPassword(value: string): ValidationResult {
  if (!value.trim()) return 'Kata sandi wajib diisi.';
  return undefined;
}

export function validateFullName(value: string): ValidationResult {
  const name = value.trim();
  if (!name) return 'Nama lengkap wajib diisi.';
  if (name.length < 3) return 'Nama minimal terdiri dari 3 karakter.';
  return undefined;
}

export function validateWhatsApp(value: string): ValidationResult {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Nomor WhatsApp wajib diisi.';
  if (digits.length < 9 || digits.length > 15) {
    return 'Nomor WhatsApp harus terdiri dari 9–15 digit.';
  }
  return undefined;
}

export function validateRegistrationPassword(value: string): ValidationResult {
  if (!value) return 'Kata sandi wajib diisi.';
  if (value.length < 8) return 'Kata sandi minimal 8 karakter.';
  return undefined;
}

export function validatePasswordConfirmation(confirmation: string, password: string): ValidationResult {
  if (!confirmation) return 'Konfirmasi kata sandi wajib diisi.';
  if (confirmation !== password) return 'Kata sandi belum cocok.';
  return undefined;
}

export function hasValidationErrors(errors: Record<string, ValidationResult>): boolean {
  return Object.values(errors).some(Boolean);
}
