import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      //checking docSnap
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* Slider img */}
      <div
        className="shareIconDiv"
        onClick={() => {
          //copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
        {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
      </div>

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer ? listing.discountPrice : listing.regularPrice}
        </p>
        <p className="listingBrand">{listing.brand}</p>
        <p className="listingType">{listing.category}</p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>{listing.color}</li>
          <li>{listing.size}</li>
          <li>{listing.condition}</li>
        </ul>
        <p className="listingLocationTitle">Meet up Location</p>

        {/* map */}

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact seller
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;