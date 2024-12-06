import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Deliveries from "../../components/crud/Deliveries";

global.fetch = jest.fn();

Object.defineProperty(document, "cookie", {
  writable: true,
  value: "auth=673eda8be91c05b9c14f8d38",
});

describe("Deliveries Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders deliveries and updated product details correctly", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          deliveries: [
            {
              _id: "673ef1f206a4888830bc98b0",
              gID: 1,
              uID: "673eda8be91c05b9c14f8d38",
              d_startDate: "2024-11-21T08:40:18.138+00:00",
              d_arriveDate: "1970-01-01T00:00:00.000+00:00",
              d_rentalTime: 7,
              d_orderAmount: 5,
              d_destination: "ntut",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: [
            {
              pID: "673cb3feebe4fd474f91275d",
              gID: 1,
              gType: "Chair",
              gPrice: 200,
              gNum: 15,
              gImage:
                "https://res.cloudinary.com/tigervision/image/upload/v1732169812/school/kari-shea-AMyjxxLEHU4-unsplash_q08tks.jpg",
              created_at: null,
              updated_at: "2024-12-03T09:03:33.975Z",
            },
          ],
        }),
      });

    render(<Deliveries />);

    await waitFor(() => {
      expect(screen.getByText("Delivery to: ntut")).toBeInTheDocument();
      expect(screen.getByText("Rental Time: 7 days")).toBeInTheDocument();
      expect(screen.getByText("Order Amount: 5")).toBeInTheDocument();
      expect(screen.getByText("Type: Chair")).toBeInTheDocument();
      expect(screen.getByText("Price: $200")).toBeInTheDocument();
      expect(screen.getByText("Available Quantity: 15")).toBeInTheDocument();
      expect(screen.getByText("Total Paid: $7000")).toBeInTheDocument();
      expect(screen.getByAltText("Chair")).toHaveAttribute("src");
    });
  });

  it("handles no deliveries gracefully", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ deliveries: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: [] }),
      });

    render(<Deliveries />);

    await waitFor(() => {
      expect(screen.getByText("No deliveries found.")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    render(<Deliveries />);

    await waitFor(() => {
      expect(screen.queryByText("Delivery to:")).not.toBeInTheDocument();
      expect(screen.queryByText("No deliveries found.")).toBeInTheDocument();
    });
  });
});
