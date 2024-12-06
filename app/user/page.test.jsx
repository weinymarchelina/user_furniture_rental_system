import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GetCurrentUser from "../../components/crud/GetCurrentUser";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  remove: jest.fn(),
}));

describe("GetCurrentUser", () => {
  it("should display user information after successful fetch", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              uName: "Test User",
              uPhone_Num: "123-456-7890",
            },
          }),
      })
    );

    render(<GetCurrentUser />);

    // Wait for User Info to appear
    await waitFor(() => {
      expect(screen.getByText("User Info")).toBeInTheDocument();
    });

    // Check that the name and phone number appear correctly
    const nameElement = screen.getByText("Name:", {
      selector: "strong",
    }).parentElement;
    const phoneElement = screen.getByText("Phone Number:", {
      selector: "strong",
    }).parentElement;

    expect(nameElement).toHaveTextContent("Name: Test User");
    expect(phoneElement).toHaveTextContent("Phone Number: 123-456-7890");
  });

  it("should handle fetch errors and display an error message", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            error: "Internal Server Error",
          }),
      })
    );

    render(<GetCurrentUser />);

    await waitFor(() =>
      expect(
        screen.getByText(/Failed to fetch user info:/i)
      ).toBeInTheDocument()
    );
  });

  it("should reload the page if 'afterLogin' cookie is present", () => {
    const reloadMock = jest.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    const mockCookies = require("js-cookie");
    mockCookies.get.mockReturnValue("true");

    render(<GetCurrentUser />);

    expect(mockCookies.remove).toHaveBeenCalledWith("afterLogin");
    expect(reloadMock).toHaveBeenCalled();
  });
});
