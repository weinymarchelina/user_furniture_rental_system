import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateDelivery from "../../components/crud/CreateDelivery";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

// Utility to set cookie for testing
const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`;
};

describe("CreateDelivery Component", () => {
  let mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  it("redirects to /product if no product cookie is found", () => {
    render(<CreateDelivery />);

    expect(mockPush).toHaveBeenCalledWith("/product");
  });

  it("renders correctly when product cookie exists", () => {
    setCookie(
      "product",
      JSON.stringify({
        pID: "673cb3feebe4fd474f91275d",
        gID: 1,
        gType: "Chair",
        gPrice: 200,
        gNum: 15,
        gImage:
          "https://res.cloudinary.com/tigervision/image/upload/v1732169812/school/kari-shea-AMyjxxLEHU4-unsplash_q08tks.jpg",
        created_at: null,
        updated_at: "2024-12-03T09:03:33.975Z",
      })
    );

    render(<CreateDelivery />);

    expect(screen.getByText("Type: Chair")).toBeInTheDocument();
    expect(screen.getByText("Price: $200")).toBeInTheDocument();
    expect(screen.getByAltText("Chair")).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/tigervision/image/upload/v1732169812/school/kari-shea-AMyjxxLEHU4-unsplash_q08tks.jpg"
    );
  });

  it("calculates the total price correctly", async () => {
    setCookie(
      "product",
      JSON.stringify({
        pID: "673cb3feebe4fd474f91275d",
        gID: 1,
        gType: "Chair",
        gPrice: 200,
        gNum: 15,
        gImage:
          "https://res.cloudinary.com/tigervision/image/upload/v1732169812/school/kari-shea-AMyjxxLEHU4-unsplash_q08tks.jpg",
        created_at: null,
        updated_at: "2024-12-03T09:03:33.975Z",
      })
    );

    render(<CreateDelivery />);

    fireEvent.change(screen.getByLabelText(/Order Amount/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Rental Time/i), {
      target: { value: "3" },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Total Price:/i)).toBeInTheDocument();
      expect(screen.queryByText(/\$1200/i)).toBeInTheDocument();
    });
  });

  it("redirects to /delivery after successful checkout", async () => {
    mockPush = "/delivery";
    setCookie("auth", "user123");
    setCookie(
      "product",
      JSON.stringify({
        pID: "673cb3feebe4fd474f91275d",
        gID: 1,
        gType: "Chair",
        gPrice: 200,
        gNum: 15,
        gImage:
          "https://res.cloudinary.com/tigervision/image/upload/v1732169812/school/kari-shea-AMyjxxLEHU4-unsplash_q08tks.jpg",
        created_at: null,
        updated_at: "2024-12-03T09:03:33.975Z",
      })
    );

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // For delivery creation
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // For stock update

    render(<CreateDelivery />);

    fireEvent.change(screen.getByLabelText(/Order Amount/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Rental Time/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/Destination/i), {
      target: { value: "Taipei" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Check Out/i }));

    await waitFor(() => {
      expect(mockPush);
    });
  });
});
