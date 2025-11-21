
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModelsDialog } from './models-dialog';
import { vi } from 'vitest';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('@/lib/auth', () => ({
    useAuth: () => mockUseAuth(),
}));

describe('ModelsDialog', () => {
    it('renders the current model name', () => {
        mockUseAuth.mockReturnValue({ isUltraUser: true });
        render(<ModelsDialog value="Gemini 3 Pro (High)" onValueChange={() => { }} user={{}} />);
        expect(screen.getByText('Gemini 3 Pro (High)')).toBeDefined();
    });

    it('calls onValueChange when a model is selected', () => {
        mockUseAuth.mockReturnValue({ isUltraUser: true });
        const handleValueChange = vi.fn();
        render(<ModelsDialog value="Gemini 3 Pro (Low)" onValueChange={handleValueChange} user={{}} />);

        // Open dialog
        fireEvent.click(screen.getByText('Gemini 3 Pro (Low)'));

        // Select new model
        fireEvent.click(screen.getByText('Gemini 3 Pro (High)'));

        expect(handleValueChange).toHaveBeenCalledWith('gemini-3-pro-high');
    });

    it('disables Pro models for non-ultra users', () => {
        mockUseAuth.mockReturnValue({ isUltraUser: false });
        render(<ModelsDialog value="Gemini 3 Pro (Low)" onValueChange={() => { }} user={{}} />);

        // Open dialog
        fireEvent.click(screen.getByText('Gemini 3 Pro (Low)'));

        // Check if Pro model is disabled
        const proModelButton = screen.getByText('Gemini 3 Pro (High)').closest('button');
        expect(proModelButton).toBeDisabled();
    });
});
