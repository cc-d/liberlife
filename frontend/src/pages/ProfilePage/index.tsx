import React, { useState, useEffect } from "react";
import { Typography, Container, Divider, Button } from "@mui/material";
import { SnapshotOut } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import apios from "../../apios";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const [snapshots, setSnapshots] = useState<SnapshotOut[]>([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const newSnapshot = async () => {
    try {
      const response = await apios.post("/snapshots");
      nav(`/snapshots/${response.data.uuid}`);
    } catch (error) {
      console.error("Error creating snapshot:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await apios.get("/snapshots");
        setSnapshots(response.data);
      } catch (error) {
        console.error("Error fetching snapshots:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [auth?.user]);

  return (
    <Container maxWidth="xl" sx={{ backgroundColor: "black" }}>
      <Typography variant="h2">Profile</Typography>
      <Typography variant="body1">
        {auth?.userLoading ? "Loading..." : auth?.user}
      </Typography>
      <Typography variant="h2">Snapshots</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => newSnapshot()}
        sx={{ mb: 2 }}
      >
        Create snapshot
      </Button>
      <Divider />
      <Typography variant="h3">Created</Typography>
      {snapshots.map((snapshot) => (
        <RouterLink to={`/snapshots/${snapshot.uuid}`}>
          <Typography
            key={snapshot.uuid}
            variant="body1"
            sx={{ cursor: "pointer" }}
          >
            {snapshot.uuid}
          </Typography>
        </RouterLink>
      ))}
    </Container>
  );
};

export default ProfilePage;
