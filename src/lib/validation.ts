export function validateCpf(cpf: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11) return false;

  // Elimina CPFs invalidos conhecidos
  if (
    [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
    ].includes(cleanCpf)
  )
    return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
}

export function validateCnpj(cnpj: string): boolean {
  const cleanCnpj = cnpj.replace(/\D/g, "");

  if (cleanCnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (/^(\d)\1+$/.test(cleanCnpj)) return false;

  let size = cleanCnpj.length - 2;
  let numbers = cleanCnpj.substring(0, size);
  const digits = cleanCnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cleanCnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

export function validateCpfCnpj(value: string): boolean {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length === 11) return validateCpf(cleanValue);
  if (cleanValue.length === 14) return validateCnpj(cleanValue);
  return false;
}
