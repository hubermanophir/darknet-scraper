import React, { useCallback, useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import { useAuth } from "../context/AuthContext";
import { Button } from "@material-ui/core";
import SwipeableTemporaryDrawer from "./SwipeableTemporaryDrawer";
import MenuListComposition from "./MenuListComposition";
import debounce from "lodash.debounce";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function PrimarySearchAppBar({
  scrapeSucceeded,
  newPostsNumber,
  setPostsVisible,
  setAlertConfigVisible,
  setCustomPostsVisible,
  matchArray,
  setMatchArray,
  setPosts,
  setNewPostsArray,
  posts,
}) {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [originalArray, setOriginalArray] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:8080/api/info/all_data");
      setOriginalArray(res.data);
    })();
  }, []);

  const changeHandler = (e) => {
    const regex = new RegExp(`${e.target.value}`, "i");
    if (posts.length > 0) {
      if (e.target.value !== "") {
        const newArray = posts.filter(
          (post) => post.content.match(regex) || post.title.match(regex)
        );
        setPosts(newArray);
      } else {
        setPosts(originalArray);
      }
    }
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 250), []);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={matchArray.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <SwipeableTemporaryDrawer
            setPostsVisible={setPostsVisible}
            setAlertConfigVisible={setAlertConfigVisible}
            setCustomPostsVisible={setCustomPostsVisible}
          />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={debouncedChangeHandler}
            />
          </div>
          <div className={classes.grow} />
          <Typography className={classes.title} variant="h6" noWrap>
            {newPostsNumber === 0
              ? `No new posts`
              : newPostsNumber === 1
              ? `New post`
              : `${newPostsNumber} new posts`}
          </Typography>
          <div className={classes.sectionDesktop}>
            <MenuListComposition
              matchArray={matchArray}
              setMatchArray={setMatchArray}
              setPostsVisible={setPostsVisible}
              setAlertConfigVisible={setAlertConfigVisible}
              setCustomPostsVisible={setCustomPostsVisible}
              setNewPostsArray={setNewPostsArray}
            />

            <IconButton aria-label="health-check-notification" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <LocalHospitalIcon
                  style={{
                    fill: scrapeSucceeded ? "green" : "red",
                    backgroundColor: "white",
                  }}
                />
              </Badge>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
