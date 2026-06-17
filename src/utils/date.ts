
import { format, differenceInYears, differenceInMonths, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(date: string | Date, fmt: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt, { locale: zhCN });
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
}

export function calcAge(birthDate: string): number {
  return differenceInYears(new Date(), parseISO(birthDate));
}

export function calcWorkYears(joinDate: string): number {
  return differenceInYears(new Date(), parseISO(joinDate));
}

export function monthsUntilRetire(birthDate: string, gender: 'male' | 'female'): number {
  const retireAge = gender === 'male' ? 60 : 55;
  const birth = parseISO(birthDate);
  const retireDate = new Date(birth.getFullYear() + retireAge, birth.getMonth(), birth.getDate());
  return differenceInMonths(retireDate, new Date());
}

export function formatIdNumber(idNumber: string): string {
  if (!idNumber || idNumber.length < 8) return idNumber;
  return idNumber.slice(0, 6) + '********' + idNumber.slice(-4);
}

export function formatPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}
