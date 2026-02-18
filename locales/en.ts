import { title } from "process";

export default {
  nav: {
    home: "Home",
    patient: "Patient Login",
    doctor: "Doctor / Secretary",
  },
  banner: {
    titleMain: "Simplify patient experience",
    titleSub: "Streamline healthcare providers’ work.",
    cardTitle: "Get Appointment",
    cardSubtitle: "Nice to see you again!",
    doctor: "Doctor",
    hospital: "Hospital",
    selectCity: "Select City",
    searchHere: "Search Here",
    searchBtn: "Search",
  },
  stats: {
    patients: "Patient Served",
    monthlyUsers: "Monthly Active Users",
    doctors: "Professional Doctors",
  },
  whyChooseUs: {
    title: "Why Choose Us?",
    subtitle: "Trusted by thousands for quality, expertise, and results.",
    stats: {
      stat0: { count: "200+", des: "Clinics Across Senegal" },
      stat1: { count: "20+", des: "Years of Experience" },
      stat2: { count: "5k", des: "Professional Doctors" },
      stat3: { count: "24/7", des: "Support Availability" },
    },
  },
  ourPackages: {
    title: "Our Health Packages",
    earlyPregnancy: "Early Pregnancy Pack",
    generalHealth: "General Health Checkup",
    cardiacCare: "Cardiac Care Package",

    antenatal: "Antenatal Checkup",
    ultrasound: "Ultrasound Scan",
    bloodUrine: "Blood & Urine Tests",

    doctorConsult: "Doctor Consultation",
    bpCheck: "Blood Pressure Check",
    basicLab: "Basic Lab Tests",

    ecg: "ECG Test",
    heartConsult: "Heart Specialist Consultation",
    cholesterol: "Cholesterol Test",

    checkBtn: "Check Details",
  },
  login: {
    title: "Login as a Provider",
    description: "Enter your details below to login",

    phoneLabel: "Phone",
    passwordLabel: "Password",

    loginBtn: "Login",
    loginLoading: "Login...",

    noAccount: "Don't have an account? Sign up",
    forgotPassword: "Forgot your password?",
    errors: {
      countryRequired: "Country code is required",
      phoneRequired: "Mobile number is required",
      phoneShort: "Phone number is too short",
      phoneLong: "Phone number is too long",
      passwordMin: "Password must be at least 6 characters",
    },
  },

  common: {
    somethingWrong: "Something went wrong",
  },
  register: {
    title: "Join Rendewou as a Provider",
    personalInfo: "Personal Information",
    professionalInfo: "Professional Information",

    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    userType: "User Type",
    email: "Email (Optional)",
    dateOfBirth: "Date of Birth",
    phone: "Phone",

    password: "Password",
    confirmPassword: "Confirm Password",

    designation: "Title / Designation",
    speciality: "Speciality",
    onms: "ONMS Registration Number (Optional)",
    statement: "Professional Statement",

    submit: "Register as a Healthcare Provider",
    creating: "Creating account...",
    alreadyAccount: "Already Have an Account?",

    genderOptions: {
      male: "Male",
      female: "Female",
    },

    userTypeOptions: {
      doctor: "Doctor",
      hospital: "Hospital",
      secretary: "Secretary",
    },

    errors: {
      firstNameMin: "First name must be at least 2 characters",
      genderRequired: "Gender is required",
      invalidEmail: "Invalid email address",
      userTypeRequired: "User type is required",

      countryRequired: "Country code is required",
      phoneRequired: "Mobile number is required",
      phoneShort: "Mobile number is too short",
      phoneLong: "Mobile number is too long",

      passwordMin: "Password must be at least 8 characters",
      passwordStrength:
        "Password must contain uppercase, lowercase, number and special character",

      confirmPasswordRequired: "Confirm password is required",

      designationRequired: "Designation is required",
      specialityRequired: "Speciality is required",

      passwordNotMatch: "Passwords do not match",
    },
  },
  appoinment: {
    SearchPlaceholder: "Search by date, location",
    today: "Todays Appointments",
    todaydescription: "See all of your appointments scheduled today",
    upcoming: "Upcoming Appointments",
    upcomingdescription: "See all of your upcoming appointments",
    no_today: "There are no today's appointments.",
    no_upcoming: "There are no upcoming appointments.",
  },
};
