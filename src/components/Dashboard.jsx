import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLands: 0,
    totalOwners: 0,
    unassignedLands: 0,
    totalOwnershipHistory: 0,
    farmingLands: 0,
    agriculturalLands: 0,
    residentialLands: 0,
    commercialLands: 0
  });
  const [role, setRole] = useState("ROLE_USER");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [landRes, ownerRes, unassignedRes, farmingRes, agricultureRes, residentialRes, commercialRes, ownershipRes] =
          await Promise.all([
            axios.get("https://landadministration-production.up.railway.app/land/records/id"),
            axios.get("https://landadministration-production.up.railway.app/land-owner/owners"),
            axios.get("https://landadministration-production.up.railway.app/land/get-unassigned-lands"),
            axios.get("https://landadministration-production.up.railway.app/land/usage-type/Farming/id"),
            axios.get("https://landadministration-production.up.railway.app/land/usage-type/Agricultural/id"),
            axios.get("https://landadministration-production.up.railway.app/land/usage-type/Residential/id"),
            axios.get("https://landadministration-production.up.railway.app/land/usage-type/Commercial/id"),
            axios.get("https://landadministration-production.up.railway.app/ownership-history/records")
          ]);

        setStats({
          totalLands: landRes.data.length,
          totalOwners: ownerRes.data.totalElements,
          unassignedLands: unassignedRes.data,
          farmingLands: farmingRes.data.length,
          agriculturalLands: agricultureRes.data.length,
          residentialLands: residentialRes.data.length,
          commercialLands : commercialRes.data.length,
          totalOwnershipHistory: ownershipRes.data
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchStats();
  }, []);

    useEffect(() =>{
        axios
        .get(`https://landadministration-production.up.railway.app/user/get-role`)
        .then((response) => {
          setRole(response.data);
          setErrorMsg("");
        })
      })

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Land Administration Dashboard</h2>

      <div className="row g-4">
        <StatCard title="Total Land Records" count={stats.totalLands} gradient="linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" />
        <StatCard title="Registered Owners" count={stats.totalOwners} gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" />
        <StatCard title="Unassigned Lands" count={stats.unassignedLands} gradient="linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)" />
        <StatCard title="Ownership History Records" count={stats.totalOwnershipHistory} gradient="linear-gradient(135deg, #d3cce3 0%, #e9e4f0 100%)" />
        <StatCard title="Farming Lands" count={stats.farmingLands} gradient="linear-gradient(135deg, #f6d365 0%, #fda085 100%)" />
        <StatCard title="Agricultural Lands" count={stats.agriculturalLands} gradient="linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)" />
        <StatCard title="Residential Lands" count={stats.residentialLands} gradient="linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)" />
        <StatCard title="Commercial Lands" count={stats.commercialLands} gradient="linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)" />
      </div>

      <hr/>

      <div className="row mt-5 g-3">
        <QuickLink title="Manage Lands" url="/manage-lands" color="wheat" classBased={role!=="ROLE_USER" ? "col-md-3" :"col-md-4"}/>
        <QuickLink title="Manage Owners" url="/manage-owners" color="#43e97b" classBased={role!=="ROLE_USER" ? "col-md-3" :"col-md-4"}/>
        <QuickLink title="Ownership History" url="/manage-history" color="red"classBased={role!=="ROLE_USER" ? "col-md-3" :"col-md-4"} />
        {role!=='ROLE_USER' ? <QuickLink title="Manage Users" url="/manage-users" color="blue"/> : null}
      </div>
    </div>
  );
};

const StatCard = ({ title, count, gradient }) => (
  <div className="col-6 col-md-6 col-lg-3">
    <div className="card text-white shadow text-center border-0" style={{ background: gradient, borderRadius: "1rem" }}>
      <div className="card-body p-3">
        <h6 className="card-title fs-6 fw-bold">{title}</h6>
        <h2 className="fw-bold">{count}</h2>
      </div>
    </div>
  </div>
);


const QuickLink = ({ title, url, color, classBased}) => (
  <div className={classBased==='col-md-4' ? "col-md-4": "col-md-3"}>
    <div className="card shadow border-0 text-center" style={{ borderRadius: "1rem" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <Link to={url} className="btn text-white mt-3" style={{ backgroundColor: color }}>
          Go to {title}
        </Link>
      </div>
    </div>
  </div>
);

export default Dashboard;
