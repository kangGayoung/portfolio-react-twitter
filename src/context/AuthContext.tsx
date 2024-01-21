// 컨텍스트로 사용자 관리
import {createContext, ReactNode, useEffect, useState} from "react";
import { User } from "firebase/auth";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {app} from "firebaseApp";

interface AuthProps {
    children: ReactNode; //자식요소인 하위 데이터 속성타입
}
const AuthContext = createContext({
    user: null as User | null, //파이어베이스에서 가져온 유저타입 넣어주기
});

export const AuthContextProvider = ({children}: AuthProps) => {
    const [currentUser, setCurrentUser] = useState<User|null>(null);
    const auth = getAuth(app)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
    }, [auth]);

    return (
        <AuthContext.Provider value={{user: currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;