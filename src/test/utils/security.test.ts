import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateCSRFToken, generateCSRFToken } from '../../lib/security';

describe('sanitizeInput', () => {
  it('should remove angle brackets', () => {
    const input = '<script>alert("xss")</script>Hello';
    const result = sanitizeInput(input);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should remove javascript: URLs', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const result = sanitizeInput(input);
    expect(result).not.toContain('javascript:');
  });

  it('should remove event handlers', () => {
    const input = '<div onClick="alert(1)">Test</div>';
    const result = sanitizeInput(input);
    expect(result).not.toContain('onClick=');
    expect(result).not.toContain('onclick=');
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello World');
  });

  it('should handle empty strings', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput('   ')).toBe('');
  });

  it('should strip all HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeInput(input);
    expect(result).toBe('pHello strongWorld/strong/p');
  });
});

describe('CSRF Token', () => {
  it('should generate a valid CSRF token', () => {
    const token = generateCSRFToken();
    expect(token).toBeTruthy();
    expect(token).toContain('.');
  });

  it('should validate a correctly generated token', () => {
    const stored = generateCSRFToken();
    const payload = stored.split('.')[0];
    const decoded = JSON.parse(atob(payload));
    const isValid = validateCSRFToken(decoded.csrf, stored);
    expect(isValid).toBe(true);
  });

  it('should reject invalid tokens', () => {
    expect(validateCSRFToken('', '')).toBe(false);
    expect(validateCSRFToken('invalid', 'invalid')).toBe(false);
  });

  it('should reject expired tokens', () => {
    const expiredPayload = btoa(JSON.stringify({ csrf: 'test', exp: Date.now() - 1000 }));
    expect(validateCSRFToken('test', `${expiredPayload}.signature`)).toBe(false);
  });
});
