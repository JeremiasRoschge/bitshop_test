import { v4 as uuidv4 } from 'uuid';

export function generateUniqueId(): number {
    const uuid = uuidv4();
    const numericValue = parseInt(uuid.replace(/\D/g, ''), 10);
    const truncatedValue = Math.abs(numericValue) % 100000000000;

    return truncatedValue;
}
