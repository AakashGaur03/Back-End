import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //validateBeforeSave is used because we are just sending refreshToken if we didnt do this then it will also validate password and all other things and that will result in error

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong While generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username,email
  // check for images,check for avatar
  // upload them to cloudinary,avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  // get user details from frontend
  //   console.log(req.body)
  const { fullName, email, username, password } = req.body;
  // console.log(fullName,email,username,password)

  // validation - not empty
  // if(fullName===""){                                         from this we need to check all in if elseif condition
  //     throw new ApiError(400,"Fullname is Required")
  // }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  // check if user already exists: username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for images,check for avatar

  // we get access of files from middleware mutler
  //   console.log(req.files)

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;
  //  Because of above Line Error coming id coverImage is not send :  Cannot read properties of undefined (reading '0')

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cloudinary,avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // it says which fields we want to remove space seprated values as a string
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while Registring the User");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req obdy -> data
  // username or email
  // Find the user
  // password check
  // access and refresh token
  // send cookie

  // req obdy -> data
  const { email, username, password } = req.body;

  // Here both are required  for any one if(!(username || email))
  if (!username && !email) {
    throw new ApiError(400, "Username and Email is Required");
  }


  // username or email
  // Find the user

  // If only one Check then  User.findOne({email})
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not Exists");
  }

  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  // access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookie
  const options = {
    // By httpOnly and secure we make our cookie to be only modifiable by only server before this it can be modified from anywhere
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // req.user is coming from middleware that we applied in route(verifyJWT)
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged Out"))

});

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken 
  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized Request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401,"Invalid Refresh Token")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh Token is expired or used")
    }
    
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const{accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken:newRefreshToken},
        "Access Token Refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Refresh Token")
  }

})

const changeCurrentPassword =asyncHandler(async(req,res)=>{
  // const { oldPassword , newPassword ,confPassword } = req.body
  // if(newPassword !== confPassword){
  //   throw new ApiError("400","New Password and Confirm Password Not Same")
  // }
  const { oldPassword , newPassword } = req.body



  const user  = await User.findById(req.user?._id)
  const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid Old Password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200,req.user,"Current User Fetched Successfully")

})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullName , email } = req.body
  if(!fullName || !email){
    throw new ApiError(400,"All Fields are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName,
        email:email
      }
    },
    {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account Details Updated Successfully"))

})

const updateUserAvatar = asyncHandler(async(req,res)=>{
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar File is Missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400,"Error While Uploading on Avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200,user,"Avatar Updated Successfully")
  )

})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400,"Cover Image File is Missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400,"Error While Uploading on cover Image")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200,user,"Cover Image Updated Successfully")
  )

})


export { registerUser, loginUser, logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage };

// NOTE
//  User is used when communicated with mongoDB
//  user is used when communicated with data that is sent
// $ are mongoDB operators
// req.cookie.refreshToken || req.body
// Where ever req.cookie.refreshToken || req.body It is used because in Mobile there is no cookie so token are send in body  