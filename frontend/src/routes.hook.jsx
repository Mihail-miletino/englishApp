import {createBrowserRouter} from "react-router-dom";
import {AuthPage} from "@components/AuthPage/AuthPage.jsx";
import {CreatePage} from "@components/CreatePage/CreatePage.jsx";
import {HomePage} from "@components/HomePage/HomePage.jsx";
import {RegPage} from "@components/RegPage/RegPage.jsx";
import {RecordsPage} from "@components/RecordsPage/RecordsPage.jsx";
import {RedirectPage} from "@components/RedirectPage/RedirectPage.jsx";
import {useAuthCheck} from "@hooks/authCheck.hook.js";
import {UserOffice} from "@components/UserOffice/UserOffice.jsx";
import {CreateQuizPage} from "@components/CreateQuizPage/CreateQuizPage.jsx";
import {RandomQuizPage} from "@components/RandomQuizPage/RandomQuizPage.jsx";
import {QuizResult} from "@components/QuizResult/QuizResult.jsx";
import {QuizzesPage} from "@components/QuizzesPage/QuizzesPage.jsx";
import {OwnQuizPage} from "@components/OwnQuizPage/OwnQuizPage.jsx";

export function useRoutes(isAuthenticated){

    function ProtectedRoute({isAuth, children}){
        if (!isAuth || !useAuthCheck()){
            return <RedirectPage/>
        }
        return children;
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage/>
        },
        {
            path: "/login",
            element: <AuthPage/>
        },
        {
            path: "/reg",
            element: <RegPage/>
        },
        {
            path: "/create",
            element: <ProtectedRoute isAuth={isAuthenticated} children={<CreatePage/>}/>
        },
        {
            path: "/words",
            element: <ProtectedRoute isAuth={isAuthenticated} children={<RecordsPage/>}/>
        },
        {
            path: "/office",
            element: <ProtectedRoute isAuth={isAuthenticated} children={<UserOffice/>}/>
        },
        {
            path: "/quiz",
            children: [
                {
                    path: "random",
                    element: <ProtectedRoute isAuth={isAuthenticated} children={<RandomQuizPage/>}/>
                },
                {
                    path: "own",
                    element: <ProtectedRoute isAuth={isAuthenticated} children={<OwnQuizPage/>}/>
                }
            ]
        },
        {
            path: "/quizzes",
            element: <ProtectedRoute isAuth={isAuthenticated} children={<QuizzesPage/>}/>
        },
        {
            path: "/quizResult",
            element: <QuizResult/>
        },
        {
            path: "/create",
            children: [
                {
                    path: "quiz",
                    element: <CreateQuizPage/>
                }
            ]
        },
        {
            path: "*",
            element: <RedirectPage/>
        }
    ]);
    return router;
}
