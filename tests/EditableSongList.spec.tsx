import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableSongList } from "../src/components/EditableSongList";

describe("EditableSongList Component", () => {
    const mockSetSongs = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Example 1: Testing that songs are rendered as inputs
     * - Uses getByDisplayValue to find controlled inputs by their current value
     */
    test("should render all songs passed in as props", () => {
        render(
            <EditableSongList
                songs={["Bohemian Rhapsody", "Hotel California"]}
                setSongs={mockSetSongs}
            />,
        );

        expect(
            screen.getByDisplayValue("Bohemian Rhapsody"),
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue("Hotel California"),
        ).toBeInTheDocument();
    });

    /**
     * Example 2: Testing empty list rendering
     * - Uses queryAllByRole to safely check for absence of elements
     */
    test("should render no inputs when songs list is empty", () => {
        render(<EditableSongList songs={[]} setSongs={mockSetSongs} />);

        const inputs = screen.queryAllByRole("textbox");
        expect(inputs).toHaveLength(0);
    });

    /**
     * Example 3: Testing the Add Song button exists
     * - Uses getByRole with name to find a specific button
     */
    test("should render the Add Song button", () => {
        render(<EditableSongList songs={[]} setSongs={mockSetSongs} />);

        const addButton = screen.getByRole("button", { name: /add song/i });
        expect(addButton).toBeInTheDocument();
    });

    /**
     * Example 4: Testing Add Song callback
     * - Verifies setSongs is called with the correct new array when Add Song is clicked
     */
    test("should call setSongs with a new empty entry when Add Song is clicked", () => {
        render(
            <EditableSongList
                songs={["Existing Song"]}
                setSongs={mockSetSongs}
            />,
        );

        const addButton = screen.getByRole("button", { name: /add song/i });
        userEvent.click(addButton);

        expect(mockSetSongs).toHaveBeenCalledTimes(1);
        expect(mockSetSongs).toHaveBeenCalledWith(["Existing Song", ""]);
    });

    /**
     * Example 5: Testing song editing callback
     * - Verifies setSongs is called with the updated value on each keystroke
     * - Uses toHaveBeenLastCalledWith to check the final state after typing
     */
    test("should call setSongs with updated value when a song is edited", () => {
        render(
            <EditableSongList songs={["Old Title"]} setSongs={mockSetSongs} />,
        );

        const input = screen.getByDisplayValue("Old Title");
        fireEvent.change(input, { target: { value: "New Title" } });

        expect(mockSetSongs).toHaveBeenCalledTimes(1);
        expect(mockSetSongs).toHaveBeenCalledWith(["New Title"]);
    });

    /**
     * Example 6: Testing delete callback
     * - Uses getAllByText to find all delete buttons and target a specific index
     * - Verifies the correct song is removed from the array
     */
    test("should call setSongs without the deleted song when ❌ is clicked", () => {
        render(
            <EditableSongList
                songs={["Song A", "Song B", "Song C"]}
                setSongs={mockSetSongs}
            />,
        );

        const deleteButtons = screen.getAllByText("❌");
        userEvent.click(deleteButtons[1]); // delete "Song B"

        expect(mockSetSongs).toHaveBeenCalledTimes(1);
        expect(mockSetSongs).toHaveBeenCalledWith(["Song A", "Song C"]);
    });

    /**
     * Example 7: Testing delete on a single-item list
     * - Verifies setSongs is called with an empty array, not that the component
     *   hides the input (since setSongs controls the actual state)
     */
    test("should call setSongs with empty array when the only song is deleted", () => {
        render(
            <EditableSongList songs={["Only Song"]} setSongs={mockSetSongs} />,
        );

        userEvent.click(screen.getByText("❌"));

        expect(mockSetSongs).toHaveBeenCalledWith([]);
    });

    /**
     * Example 8: Testing that delete buttons match the number of songs
     * - Uses getAllByRole to count buttons and verify structure
     */
    test("should render one delete button per song", () => {
        render(
            <EditableSongList
                songs={["Song A", "Song B", "Song C"]}
                setSongs={mockSetSongs}
            />,
        );

        const deleteButtons = screen.getAllByText("❌");
        expect(deleteButtons).toHaveLength(3);
    });
});
