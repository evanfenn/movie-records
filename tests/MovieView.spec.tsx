import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MovieView } from "../src/components/MovieView";
import type { Movie } from "../src/interfaces/movie";

describe("MovieView Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: false,
            liked: false,
            when: null,
        },
    };

    const mockDeleteMovie = jest.fn();
    const mockEditMovie = jest.fn();
    const mockSetMovieWatched = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieView
                movie={mockMovie}
                deleteMovie={mockDeleteMovie}
                editMovie={mockEditMovie}
                setMovieWatched={mockSetMovieWatched}
            />,
        );
    });

    /**
     * Rendering: verify movie data is displayed on initial load
     */
    test("renders the movie title", () => {
        expect(screen.getByText("The Test Movie")).toBeInTheDocument();
    });

    test("renders the release year", () => {
        expect(screen.getByText(/Released 2020/i)).toBeInTheDocument();
    });

    test("renders the movie description", () => {
        expect(screen.getByText("A movie for testing")).toBeInTheDocument();
    });

    /**
     * Editing state: MovieEditor should not be visible initially.
     * It is conditionally rendered with {editing && <MovieEditor />}
     * so it won't exist in the DOM at all when editing is false.
     */
    test("does not render MovieEditor on initial load", () => {
        // These buttons only exist inside MovieEditor
        expect(
            screen.queryByRole("button", { name: /save/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /cancel/i }),
        ).not.toBeInTheDocument();
    });

    /**
     * Editing state: clicking the Edit button (inside RecordControls)
     * calls changeEditing, which flips editing to true, which mounts MovieEditor.
     */
    test("shows MovieEditor when Edit button is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(
            screen.getByRole("button", { name: /save/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /cancel/i }),
        ).toBeInTheDocument();
    });

    /**
     * Editing state: when editing is true, the view div is hidden via
     * display:none rather than unmounted, so its content is still in the DOM.
     */
    test("hides the view container when editing", () => {
        userEvent.click(screen.getByRole("button", { name: /edit/i }));
        // The title is still in the DOM but inside a display:none div
        const title = screen.getByText("The Test Movie");
        expect(
            title.closest("div[style*='display: none']"),
        ).toBeInTheDocument();
    });

    /**
     * Editing state: clicking Cancel inside MovieEditor calls changeEditing
     * again, flipping editing back to false and unmounting MovieEditor.
     */
    test("hides MovieEditor when Cancel is clicked", () => {
        userEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(
            screen.getByRole("button", { name: /cancel/i }),
        ).toBeInTheDocument();

        userEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(
            screen.queryByRole("button", { name: /cancel/i }),
        ).not.toBeInTheDocument();
    });
});
