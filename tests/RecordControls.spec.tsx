import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordControls } from "../src/components/RecordControls";
import type { Watch } from "../src/interfaces/watch";

describe("RecordControls Component", () => {
    const mockChangeEditing = jest.fn();
    const mockSetMovieWatched = jest.fn();

    // Helper to avoid repeating render logic
    function renderComponent(watched: Watch) {
        render(
            <RecordControls
                watched={watched}
                changeEditing={mockChangeEditing}
                setMovieWatched={mockSetMovieWatched}
            />,
        );
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Rendering: Edit button is always present regardless of watch state
     */
    test("always renders the Edit button", () => {
        renderComponent({ seen: false, liked: false, when: null });
        expect(
            screen.getByRole("button", { name: /edit/i }),
        ).toBeInTheDocument();
    });

    /**
     * Rendering: when not seen, show "Mark as watched", hide liked buttons
     */
    test("renders Mark as watched button when seen is false", () => {
        renderComponent({ seen: false, liked: false, when: null });
        expect(
            screen.getByRole("button", { name: /mark as watched/i }),
        ).toBeInTheDocument();
    });

    test("does not render Mark as unwatched when seen is false", () => {
        renderComponent({ seen: false, liked: false, when: null });
        expect(
            screen.queryByRole("button", { name: /mark as unwatched/i }),
        ).not.toBeInTheDocument();
    });

    test("does not render liked/not liked buttons when seen is false", () => {
        renderComponent({ seen: false, liked: false, when: null });
        expect(
            screen.queryByRole("button", { name: /liked/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /not liked/i }),
        ).not.toBeInTheDocument();
    });

    /**
     * Rendering: when seen and liked
     */
    test("renders Mark as unwatched button when seen is true", () => {
        renderComponent({ seen: true, liked: true, when: "2023-01-01" });
        expect(
            screen.getByRole("button", { name: /mark as unwatched/i }),
        ).toBeInTheDocument();
    });

    test("renders Liked button when seen and liked are true", () => {
        renderComponent({ seen: true, liked: true, when: "2023-01-01" });
        expect(
            screen.getByRole("button", { name: /liked/i }),
        ).toBeInTheDocument();
    });

    /**
     * Rendering: when seen but not liked
     */
    test("renders Not liked button when seen is true and liked is false", () => {
        renderComponent({ seen: true, liked: false, when: "2023-01-01" });
        expect(
            screen.getByRole("button", { name: /not liked/i }),
        ).toBeInTheDocument();
    });

    /**
     * Callbacks: verify setMovieWatched is called with correct args
     */
    test("calls setMovieWatched(true, false) when Mark as watched is clicked", () => {
        renderComponent({ seen: false, liked: false, when: null });
        userEvent.click(
            screen.getByRole("button", { name: /mark as watched/i }),
        );
        expect(mockSetMovieWatched).toHaveBeenCalledWith(true, false);
    });

    test("calls setMovieWatched(false, false) when Mark as unwatched is clicked", () => {
        renderComponent({ seen: true, liked: false, when: "2023-01-01" });
        userEvent.click(
            screen.getByRole("button", { name: /mark as unwatched/i }),
        );
        expect(mockSetMovieWatched).toHaveBeenCalledWith(false, false);
    });

    test("calls setMovieWatched(true, false) when Liked is clicked", () => {
        renderComponent({ seen: true, liked: true, when: "2023-01-01" });
        userEvent.click(screen.getByRole("button", { name: /liked/i }));
        expect(mockSetMovieWatched).toHaveBeenCalledWith(true, false);
    });

    test("calls setMovieWatched(true, true) when Not liked is clicked", () => {
        renderComponent({ seen: true, liked: false, when: "2023-01-01" });
        userEvent.click(screen.getByRole("button", { name: /not liked/i }));
        expect(mockSetMovieWatched).toHaveBeenCalledWith(true, true);
    });

    /**
     * Callbacks: Edit button calls changeEditing
     */
    test("calls changeEditing when Edit is clicked", () => {
        renderComponent({ seen: false, liked: false, when: null });
        userEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });

    test("does not call setMovieWatched when Edit is clicked", () => {
        renderComponent({ seen: false, liked: false, when: null });
        userEvent.click(screen.getByRole("button", { name: /edit/i }));
        expect(mockSetMovieWatched).not.toHaveBeenCalled();
    });
});
