import GetCurrentUser from "../../components/crud/GetCurrentUser";
import Footer from "../../components/ui/Footer";

export default function User(){
    return (
        <div>
            <GetCurrentUser />
            <Footer />
        </div>
    )
}