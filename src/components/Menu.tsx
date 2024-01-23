import  {useNavigate} from "react-router-dom";
import {BsHouse} from "react-icons/bs";
import {AiOutlineSearch} from "react-icons/ai";
import {BiUserCircle} from "react-icons/bi";
import {MdLogout, MdLogin} from "react-icons/md";
import {useContext} from "react";
import AuthContext from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import {app} from "../firebaseApp";
import {toast} from "react-toastify";

export default function MenuList() {
    const {user} = useContext(AuthContext);
    //console.log(user)
    const navigate = useNavigate();
    return (
        <div className="footer">
            <div className="footer_grid">
                <button type="button" onClick={() => navigate("/")}><BsHouse />Home</button>
                <button type="button" onClick={() => navigate("/profile")}><BiUserCircle/>Profile</button>
                <button type="button" onClick={() => navigate("/search")}><AiOutlineSearch/>Search</button>
                {user === null ? (
                    <button type="button" onClick={() => navigate("/user/login")}><MdLogin/>Login</button>
                    ) : (
                    <button type="button" onClick={async () => {
                        const auth = getAuth(app);
                        //사용자를 로그아웃시키려면 signOut을 호출
                        await signOut(auth);
                        toast.success("로그아웃 되었습니다.")
                    }}>
                        <MdLogout/>
                        Logout
                    </button>
                )}

            </div>
        </div>
    );
}