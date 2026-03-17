import React from "react";
import { HomePageIzbori } from "../pages/eIzbori/HomePageIzbori";
import { ElectionsResultsPage } from "../pages/eIzbori/ElectionsResultsPage";
import { HomePage } from "../pages/HomePage";
import { HomePageAktivnosti } from "pages/eAktivnosti/HomePageAktivnosti";
import { HomePageInfo } from "../pages/eInfo/HomePageInfo";
import { HomePagePartneri } from "../pages/ePartneri/HomePagePartneri";
import PartnerDetaisPage from "../pages/ePartneri/PartnerDetailsPage";
import { HomePageEAdmin } from "pages/eAdmin/HomePageEAdmin";
import { SuprachHomePage } from "pages/suprach/SuprachHomePage";
import { GreadingUserPage } from "pages/suprach/GreadingUserPage";
import { CommentUserPage } from "pages/suprach/CommentUserPage";
import { UsersWhoNotFillPage } from "pages/suprach/UsersWhoNotFillPage";
interface Routes {
  path: string;
  element: React.ReactElement;
  key: string;
}
export const routes: Routes[] = [
  {
    path: "/",
    element: <HomePage />,
    key: "/",
  },
  {
    path: "/activity",
    element: <HomePageAktivnosti />,
    key: "/activity",
  },
  {
    path: "/info",
    element: <HomePageInfo />,
    key: "/info",
  },
  {
    path: "/partners",
    element: <HomePagePartneri />,
    key: "/partners",
  },
  {
    path: "/partners/:partnerId",
    element: <PartnerDetaisPage />,
    key: "/partners/:partnerId",
  },
  {
    path: "/elections",
    element: <HomePageIzbori />,
    key: "/elections",
  },
  {
    path: "/admin/elections/results",
    element: <ElectionsResultsPage />,
    key: "/admin/elections/results",
  },
  {
    path: "/admin",
    element: <HomePageEAdmin />,
    key: "/admin",
  },
  {
    path: "/suprach",
    element: <SuprachHomePage />,
    key: "/suprach",
  },
  {
    path: "/suprach/comments",
    element: <CommentUserPage />,
    key: "/suprach/comments",
  },
  {
    path: "/suprach/users/notfill",
    element: <UsersWhoNotFillPage />,
    key: "/suprach/users/notfill",
  },
  {
    path: "/suprach/grading/:userToGradeId/:isSpecialUser/:name",
    element: <GreadingUserPage />,
    key: "/suprach/grading/:userToGradeId/:isSpecialUser/:name",
  },
];
