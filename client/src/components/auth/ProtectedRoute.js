import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth";
import SkeletonLoader from "../common/SkeletonLoader"

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <SkeletonLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute