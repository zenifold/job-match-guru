import { Routes as RouterRoutes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Index } from "@/pages/Index";
import { Builder } from "@/pages/Builder";
import { Preview } from "@/pages/Preview";
import { Resumes } from "@/pages/Resumes";
import { Login } from "@/pages/Login";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Index />} />
        <Route path="builder" element={<Builder />} />
        <Route path="preview" element={<Preview />} />
        <Route path="resumes" element={<Resumes />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </RouterRoutes>
  );
};

export default Routes;