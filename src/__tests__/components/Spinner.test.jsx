import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from '../../components/Spinner';

describe('Spinner Component', () => {
    describe('Rendering', () => {
        it('should render spinner with default medium size', () => {
            const { container } = render(<Spinner />);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveClass('w-5', 'h-5');
        });

        it('should render small spinner', () => {
            const { container } = render(<Spinner size="sm" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('w-4', 'h-4');
        });

        it('should render medium spinner', () => {
            const { container } = render(<Spinner size="md" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('w-5', 'h-5');
        });

        it('should render large spinner', () => {
            const { container } = render(<Spinner size="lg" />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('w-8', 'h-8');
        });
    });

    describe('Animation', () => {
        it('should have spin animation class', () => {
            const { container } = render(<Spinner />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('animate-spin');
        });

        it('should have white color for visibility on colored backgrounds', () => {
            const { container } = render(<Spinner />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('text-white');
        });
    });

    describe('SVG Structure', () => {
        it('should render circle element', () => {
            const { container } = render(<Spinner />);
            const circle = container.querySelector('circle');
            expect(circle).toBeInTheDocument();
            expect(circle).toHaveAttribute('cx', '12');
            expect(circle).toHaveAttribute('cy', '12');
            expect(circle).toHaveAttribute('r', '10');
        });

        it('should render path element', () => {
            const { container } = render(<Spinner />);
            const path = container.querySelector('path');
            expect(path).toBeInTheDocument();
        });

        it('should have proper opacity classes for visual effect', () => {
            const { container } = render(<Spinner />);
            const circle = container.querySelector('circle');
            const path = container.querySelector('path');

            expect(circle).toHaveClass('opacity-25');
            expect(path).toHaveClass('opacity-75');
        });
    });

    describe('Accessibility', () => {
        it('should have proper viewBox for SVG', () => {
            const { container } = render(<Spinner />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        });

        it('should not have fill attribute to allow currentColor', () => {
            const { container } = render(<Spinner />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('fill', 'none');
        });
    });
});
