import type { LoggedVisitor } from '../types';

const LOG_KEY = 'visioTrackLog';

/**
 * Retrieves the visitor log from localStorage.
 * @returns {LoggedVisitor[]} The parsed visitor log, or an empty array if not found or invalid.
 */
export const getVisitorLog = (): LoggedVisitor[] => {
    try {
        const storedLog = localStorage.getItem(LOG_KEY);
        if (storedLog) {
            // A simple validation to make sure we are parsing an array
            const parsed = JSON.parse(storedLog);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (error) {
        console.error("Failed to parse visitor log from localStorage", error);
    }
    return [];
};

/**
 * Saves the visitor log to localStorage.
 * @param {LoggedVisitor[]} log The visitor log array to save.
 */
export const saveVisitorLog = (log: LoggedVisitor[]): void => {
    try {
        localStorage.setItem(LOG_KEY, JSON.stringify(log));
    } catch (error) {
        console.error("Failed to save visitor log to localStorage", error);
    }
};
