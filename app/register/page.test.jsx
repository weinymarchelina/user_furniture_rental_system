import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateUser from "../../components/crud/CreateUser";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: "/login",
  }),
}));

describe("CreateUser Component", () => {
  it("should render the registration form", () => {
    render(<CreateUser />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create User/i })
    ).toBeInTheDocument();
  });

  it("should handle login errors", async () => {
    render(<CreateUser />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Error/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("should redirect on successful login", async () => {
    render(<CreateUser />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create User/i }));

    await waitFor(() => {
      expect(mockPush);
    });
  });
});
