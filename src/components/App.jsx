import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation,  Link } from "react-router-dom";
import ListLand from "./LandComponents/ListLand";
import DisplayLandOwner from "./LandOwnerComponents/DisplayLandOwner";
import Header from "./Header";
import Footer from "./Footer";
import "../Footer.css"
import "../App.css"
import Login from "./Authentication,Login & Register/Login";
import RequireAuth from "./Authentication,Login & Register/RequireAuth";
import "./axiosConfig";
import Home from "./Home";
import ListLandOwners from "./LandOwnerComponents/ListLandOwners";
import Register from "./Authentication,Login & Register/Register";
import OAuth2Redirect from "./Authentication,Login & Register/OAuth2Redirect";
import Dashboard from "./Dashboard";
import ListUsers from "./UserComponents/ListUsers";
import ListHistory from "./HistoryComponents/ListHistory";
import UserLogs from "./UserComponents/UserLogs";
import SetUserRole from "./UserComponents/SetUserRole";
import ManageUsers from "./UserComponents/ManageUsers";
import DeleteUser from "./UserComponents/DeleteUser";
import ViewUserLogsById from "./UserComponents/ViewUserLogsById";
import UserById from "./UserComponents/UserById";
import ManageLands from "./LandComponents/ManageLands";
import SearchLands from "./LandComponents/SearchLands";
import ViewBySurfaceArea from "./LandComponents/ViewBySurfaceArea";
import DeleteLand from "./LandComponents/DeleteLand";
import ViewLandById from "./LandComponents/ViewLandById";
import Profile from "./UserComponents/Profile";
import AddLand from "./LandComponents/AddLand";
import ManageOwners from "./LandOwnerComponents/ManageOwners";
import ViewLandsByOwnerId from "./LandOwnerComponents/ViewLandsByOwnerId";
import ViewOwnerById from "./LandOwnerComponents/ViewOwnerById";
import { Table } from "react-bootstrap";
import AddLandOwner from "./LandOwnerComponents/AddLandOwner";
import { useEffect } from "react";
import GitHubPagesFix from "./Authentication,Login & Register/GitHubPagesFix";
import ManageHistory from "./HistoryComponents/ManageHistory";
import HistoryByLandId from "./HistoryComponents/HistoryByLandId";
import HistoryByOwnerId from "./HistoryComponents/HistoryByOwnerId";



function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
  };

  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <Header />
      <Routes>
        <Route path="/index.html" element={<GitHubPagesFix />} />
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/sign-up" element={<Register/>} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route 
          path="/dashboard" 
          element={
          <RequireAuth>
            <Dashboard/>
          </RequireAuth>} />
        <Route 
          path='/owners'
          element={
          <RequireAuth>
            <ListLandOwners/>
        </RequireAuth>}/>
        <Route
          path="/lands"
          element={
            <RequireAuth>
              <ListLand />
            </RequireAuth>
          }
        />
        <Route
          path="/display-land-owner"
          element={
            <RequireAuth>
              <DisplayLandOwner />
            </RequireAuth>
          }
        />


        <Route
          path="/manage-users"
          element={
            <RequireAuth>
              <ManageUsers/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/manage-lands"
          element={
            <RequireAuth>
              <ManageLands/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/lands/search"
          element={
            <RequireAuth>
              <SearchLands/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/lands/by-surface-area"
          element={
            <RequireAuth>
              <ViewBySurfaceArea/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/lands/delete"
          element={
            <RequireAuth>
              <DeleteLand/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/lands/by-id"
          element={
            <RequireAuth>
              <ViewLandById/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/lands/add-land"
          element={
            <RequireAuth>
              <AddLand/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile/>
            </RequireAuth>
          }
        
        />


        





        <Route
          path="/view-logs-by-id"
          element={
            <RequireAuth>
              <ViewUserLogsById/>
            </RequireAuth>
          }
        
        />


        <Route
          path="/all-users"
          element={
            <RequireAuth>
              <ListUsers/>
            </RequireAuth>
          }
        
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <ListHistory/>
            </RequireAuth>
          }
        />
        <Route
          path="/user-logs"
          element={
            <RequireAuth>
              <UserLogs/>
            </RequireAuth>
          }
        />
        <Route
          path="/set-role"
          element={
            <RequireAuth>
              <SetUserRole/>
            </RequireAuth>
          }
        />
        <Route
          path="/delete-user"
          element={
            <RequireAuth>
              <DeleteUser/>
            </RequireAuth>
          }
        />
        <Route
          path="/get-user"
          element={
            <RequireAuth>
              <UserById/>
            </RequireAuth>
          }
        />
        <Route
          path="/manage-owners"
          element={
            <RequireAuth>
              <ManageOwners/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/owners/lands-by-owner-id"
          element={
            <RequireAuth>
              <ViewLandsByOwnerId/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/owners/owner-by-id"
          element={
            <RequireAuth>
              <ViewOwnerById/>
            </RequireAuth>
          }
        
        />

        <Route
          path="/owners/add"
          element={
            <RequireAuth>
              <AddLandOwner />
            </RequireAuth>
          }
        />

        <Route
          path="/manage-history"
          element={
            <RequireAuth>
              <ManageHistory />
            </RequireAuth>
          }
        />

        <Route
          path="/history/all-records"
          element={
            <RequireAuth>
              <ListHistory />
            </RequireAuth>
          }
        />

        <Route
          path="/history/records-by-land-id"
          element={
            <RequireAuth>
              <HistoryByLandId/>
            </RequireAuth>
          }
        />

        <Route
          path="/history/records-by-owner-id"
          element={
            <RequireAuth>
              <HistoryByOwnerId/>
            </RequireAuth>
          }
        />

        

        

        



      </Routes>
      <Footer />
    </div>
  );
}

export default App;
