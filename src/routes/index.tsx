import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { PrivateRoute } from "./PrivateRoute";
import { HomeWrapper } from "../wrappers/HomeWrapper";
import { Profile } from "../pages/Profile";
import { Product } from "../pages/Product";
import { SearchResults } from "../pages/SearchResults";
import { CadastroLogin } from "../pages/RegisterLogin";
import { CategoryPreferences } from "../pages/CategoryPreferences";
import { Unauthorized } from "../pages/Unauthorized";
import { Category } from "../pages/Category";
import { ExploreCategory } from "../pages/Category/ExploreCategory";
import { Store } from "../pages/Store";
import { Details } from "../pages/Store/Details";
import { Wishlist } from "../pages/Wishlist";
import { Assessment } from "../pages/Assessment";
import { Comments } from "../pages/Assessment/Comments";
import { SwitchProfiles } from "../pages/Profile/SwitchProfiles";
import { AnalyticsDashboard } from "../pages/AnalyticsDashboard";
import { ProductList } from "../pages/Product/ProductList";
import { RegisterProduct } from "../pages/Product/RegisterProduct";
import { Information } from "../pages/Store/Register/Information";
import { Address } from "../pages/Store/Register/Address";
import { Images } from "../pages/Store/Register/Images";
import { Contact } from "../pages/Store/Register/Contact";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CadastroLogin />} />
      <Route path="/categoryPreferences/:id" element={<CategoryPreferences />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/store/:id" element={<Store />} />
      <Route path="/store/details/:id" element={<Details />} />
      <Route path="/store/register/information" element={<Information />} />
      <Route path="/store/register/address" element={<Address />} />
      <Route path="/store/register/contact" element={<Contact />} />
      <Route path="/store/register/images" element={<Images />} />
      <Route path="/assessment/:idStore" element={<Assessment />} />
      <Route path="/comments/:idStore" element={<Comments />} />
      <Route path="/category" element={<Category />} />
      <Route path="/category/:category" element={<ExploreCategory />} />
      <Route path="/search/:searchTerm" element={<SearchResults />} />
      <Route path="/switchProfile" element={<SwitchProfiles />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/productList" element={<ProductList />} />
      <Route path="/product/register" element={<RegisterProduct />} />
      <Route path="/dashboard" element={<AnalyticsDashboard />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomeWrapper />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
