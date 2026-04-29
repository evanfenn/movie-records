import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            />,
        );
    });

    /**
     * Rendering: verify all initial values are displayed correctly
     */
    test("renders MovieEditor with initial movie title", () => {
        expect(screen.getByDisplayValue("The Test Movie")).toBeInTheDocument();
    });

    test("renders MovieEditor with initial release year", () => {
        expect(screen.getByDisplayValue("2020")).toBeInTheDocument();
    });

    test("renders MovieEditor with initial description", () => {
        expect(
            screen.getByDisplayValue("A movie for testing"),
        ).toBeInTheDocument();
    });

    test("renders Save, Cancel, and Delete buttons", () => {
        expect(
            screen.getByRole("button", { name: /save/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /cancel/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /delete/i }),
        ).toBeInTheDocument();
    });

    /**
     * Save: verify editMovie and changeEditing are called with correct data
     */
    test("calls editMovie with updated title when Save is clicked", () => {
        const titleInput = screen.getByDisplayValue("The Test Movie");
        fireEvent.change(titleInput, { target: { value: "Updated Title" } });

        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({ title: "Updated Title" }),
        );
    });

    test("calls editMovie with updated release year when Save is clicked", () => {
        const yearInput = screen.getByDisplayValue("2020");
        fireEvent.change(yearInput, { target: { value: "2024" } });

        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({ released: 2024 }),
        );
    });

    test("calls editMovie with updated description when Save is clicked", () => {
        const descInput = screen.getByDisplayValue("A movie for testing");
        fireEvent.change(descInput, { target: { value: "New description" } });

        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({ description: "New description" }),
        );
    });

    test("calls changeEditing after Save is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /save/i }));
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });

    /**
     * Cancel: verify only changeEditing is called, not editMovie
     */
    test("calls changeEditing when Cancel is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });

    test("does not call editMovie when Cancel is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(mockEditMovie).not.toHaveBeenCalled();
    });

    /**
     * Delete: verify deleteMovie is called with the correct id
     */
    test("calls deleteMovie with correct id when Delete is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /delete/i }));
        expect(mockDeleteMovie).toHaveBeenCalledTimes(1);
        expect(mockDeleteMovie).toHaveBeenCalledWith("test-movie-123");
    });

    test("does not call editMovie or changeEditing when Delete is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /delete/i }));
        expect(mockEditMovie).not.toHaveBeenCalled();
        expect(mockChangeEditing).not.toHaveBeenCalled();
    });

    /**
     * Rating: verify the select renders with the correct initial value
     * rating 8 maps to "⭐⭐⭐⭐✰" (value "8")
     */
    test("renders rating select with correct initial value", () => {
        const ratingSelect = screen.getByRole("combobox");
        expect(ratingSelect).toHaveValue("8");
    });

    test("calls editMovie with updated rating when Save is clicked", () => {
        const ratingSelect = screen.getByRole("combobox");
        fireEvent.change(ratingSelect, { target: { value: "4" } });

        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({ rating: 4 }),
        );
    });
});
