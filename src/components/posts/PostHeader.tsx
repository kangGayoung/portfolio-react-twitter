import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function PostHeader() {
    const navigate = useNavigate();
    return (
        <div className="post_header">
            {/*뒤로가기*/}
            <button type="button" onClick={() => navigate(-1)}>
                <IoIosArrowBack className="post_header-btn"/>
            </button>
        </div>
    );
}