import PostHeader from "../../components/posts/PostHeader";
import React, {useContext, useEffect, useState} from "react";
import {FiImage} from "react-icons/fi";
import AuthContext from "context/AuthContext";
import {deleteObject, getDownloadURL, ref, uploadString} from "firebase/storage";

import {v4 as uuidv4} from "uuid";
import {storage} from "../../firebaseApp";
import { updateProfile } from "firebase/auth";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

export default function ProfileEditPage(){
    const [displayName, setDisplayName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {value},
        } = e;

        setDisplayName(value); // 사용자이름 변경 가능
    };

    const onSubmit = async (e:any) => {
        let key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);
        let newImageUrl = null;

        e.preventDefault();

        try {
            // 기존 유저 이미지가 firebase Storage 이미지일 경우에만 삭제
            if (user?.photoURL &&
                user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)
            ){ //유저에 기존 이미지가 있는 경우
                const imageRef = ref(storage, user?.photoURL);
                await deleteObject(imageRef).catch((error) => {
                    console.log(error);
                });
            }
            // 이미지 업로드
            if(imageUrl){
                const data = await uploadString(storageRef, imageUrl, "data_url");
                newImageUrl = await getDownloadURL(data?.ref);
            }
            // updateProfile 호출
            if(user){
                await updateProfile(user, {
                    displayName: displayName || "",
                    photoURL: newImageUrl || "", //프로필 이미지 삭제 후 업데이트
                }).then(() => {
                    toast.success("프로필이 업데이트 되었습니다.");
                    navigate("/profile");
                }).catch((error) => {
                    console.log(error);
                });
            }
        } catch (e:any){
            console.log(e);
        }
    };

    /**
    FileReader API
    - 웹 애플리케이션에서 비동기적으로 파일을 읽게 해줌(파일업로드 or  이미지 트레이드시 사용)

    .readeAsDataURL() 메서드
    - 컨텐츠를 특정 데이터 url로 가져옴(인코딩된 스트링 데이터로 받아옴)

    .loadend 이벤트
    - .readeAsDataURL() 메서드 끝나는지 안끝나는지 확인 가능
    - 파일 읽기가 끝나면 실행 */

    const handleFileUpload = (e: any) => {
        const {
            target: {files},
        } = e;

        const file = files?.[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (e:any) => {
            const {result} = e?.currentTarget;
            setImageUrl(result);
        }
    };

    const handleDeleteImage = () => {
        setImageUrl(null);
    };

    // 사용자 이미지가 있는경우
    useEffect(() => {
        //console.log(user); //user 안에 이미지위치 키값(photoURL) 확인
        if(user?.photoURL){
            setImageUrl(user?.photoURL);
        }
        if(user?.displayName){
            setDisplayName(user?.displayName); //처음 마운팅 될때 사용자 이름 셋팅
        }
    }, [user?.displayName, user?.photoURL]);

    return (
        <div className="post">
            <PostHeader />
            <form className="post-form" onSubmit={onSubmit}>
                <div className="post-form_profile">
                    <input
                        type="text"
                        name="displayName"
                        className="post-form_input"
                        placeholder="이름"
                        onChange={onChange}
                        value={displayName}
                    />
                    {imageUrl && (
                        <div className="post-form_attachment">
                            <img src={imageUrl} alt="attachment" width={100} height={100} />
                            <button type="button" onClick={handleDeleteImage} className="post-form_clear-btn">
                                삭제
                            </button>
                        </div>
                    )}
                    <div className="post-form_submit-area">
                        <div className="post-form_image-area">
                            <label className="post-form_file" htmlFor="file-input">
                                <FiImage className="post-form_file-icon" />
                            </label>
                        </div>
                        <input
                            type="file"
                            name="file-input"
                            id="file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <input
                            type="submit"
                            value="프로필 수정"
                            className="post-form_submit-btn"
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}