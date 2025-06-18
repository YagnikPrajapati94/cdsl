"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    unregister,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cfi: {
        voting: "",
        paymentStatus: "",
        noOfShares: "",
        particulars: "",
        paidUpValue: "",
      },
      addressChoice: "same",
      service: "Single Point Connectivity [Physical + Electronic]",
      billingAddressChoice: "Same as Registered Office Address",
      complianceOfficerChoice: "Same as Company Secretary",
      directors: [{ name: "", role: "", pan: "", din: "" }],
      promoters: [{ name: "", details: "", pan: "" }],
      companyName: "",
      otherSecurity: "no",
      issuedSharesCurrentYear: [
        {
          nature: "",
          noOfShares: "",
          date: "",
          faceValue: "",
          fullyPaid: "",
          partlyPaid: "",
          distinctiveNos: "",
        },
      ],
      issuedSharesTotals: {
        totalNoOfShares: "",
        totalFaceValue: "",
      },
      shareholding: {
        promoters: {
          shareholders: "",
          sharesHeld: "",
        },
        nonPromoters: {
          shareholders: "",
          sharesHeld: "",
        },
        totals: {
          totalShareholders: 0,
          totalSharesHeld: 0,
          totalPercentage: 100,
        },
      },
    },
  });
  const votingOptions = [
    "voting",
    "nonVoting",
    "restrictedVoting",
    "enhancedVoting",
  ];
  const paymentOptions = ["partlyPaid", "fullyPaid"];

  // Watch all
  const selectedVoting = watch("cfi.voting");
  const selectedPayment = watch("cfi.paymentStatus");
  const promoterShareholders = Number(
    watch("shareholding.promoters.shareholders") || 0
  );
  const nonPromoterShareholders = Number(
    watch("shareholding.nonPromoters.shareholders") || 0
  );

  const promoterShares = Number(
    watch("shareholding.promoters.sharesHeld") || 0
  );
  const nonPromoterShares = Number(
    watch("shareholding.nonPromoters.sharesHeld") || 0
  );

  const totalShareholders = promoterShareholders + nonPromoterShareholders;
  const totalSharesHeld = promoterShares + nonPromoterShares;
  useEffect(() => {
    setValue("shareholding.totals.totalShareholders", totalShareholders);
    setValue("shareholding.totals.totalSharesHeld", totalSharesHeld);
    setValue("shareholding.totals.totalPercentage", 100); // Always fixed
  }, [totalShareholders, totalSharesHeld]);

  const totalShares = Number(promoterShares) + Number(nonPromoterShares);

  const promoterPercentage = totalShares
    ? ((promoterShares / totalShares) * 100).toFixed(2)
    : "0.00";
  const nonPromoterPercentage = totalShares
    ? ((nonPromoterShares / totalShares) * 100).toFixed(2)
    : "0.00";
  const {
    fields: issueFields,
    append: appendIssue,
    remove: removeIssue,
  } = useFieldArray({
    control,
    name: "issuedSharesCurrentYear",
  });

  const currentIssues = watch("issuedSharesCurrentYear");

  const totalIssuedShares = currentIssues?.reduce(
    (sum, row) => sum + (Number(row.noOfShares) || 0),
    0
  );

  const totalFaceValueIssued = currentIssues?.reduce(
    (sum, row) =>
      sum + (Number(row.noOfShares) || 0) * (Number(row.faceValue) || 0),
    0
  );
  const authorisedShares = watch("equityCapital.authorised.noOfShares");
  const issuedShares = watch("equityCapital.issued.noOfShares");
  const paidUpShares = watch("equityCapital.paidUp.noOfShares");
  const issuedPaidUp = watch("equityCapital.issued.paidUpValue");
  const issuedFace = watch("equityCapital.issued.faceValue");
  const paidUpPaidUp = watch("equityCapital.paidUp.paidUpValue");
  const paidUpFace = watch("equityCapital.paidUp.faceValue");

  const difference = (Number(issuedShares) || 0) - (Number(paidUpShares) || 0);
  const paidUpShareWarning = Number(paidUpShares) > Number(issuedShares);
  const paidUpValueWarning = Number(paidUpPaidUp) > Number(paidUpFace);
  const showExtraNotes = Number(authorisedShares) > 1000000;
  const [rows, setRows] = useState([{ name: "", date: "" }]);

  const registeredOfficeAddress = watch("registeredOfficeAddress");
  const companyName = watch("companyName");
  const otherSecurity = watch("otherSecurity");
  const correspondenceOfficeAddress = watch("correspondenceOfficeAddress");
  const addressChoice = watch("addressChoice");
  const billingAddress = watch("billingAddress");
  const billingAddressChoice = watch("billingAddressChoice");
  const complianceOfficerChoice = watch("complianceOfficerChoice");
  useEffect(() => {
    setValue("issuedSharesTotals.totalNoOfShares", totalIssuedShares);
    setValue("issuedSharesTotals.totalFaceValue", totalFaceValueIssued);
  }, [totalIssuedShares, totalFaceValueIssued]);

  useEffect(() => {
    if (addressChoice === "same") {
      setValue("correspondenceOfficeAddress", {}); // clear all
    }
  }, [addressChoice]);
  useEffect(() => {
    if (otherSecurity === "no") {
      setValue("isin", ""); // clear all
    }
  }, [otherSecurity]);
  useEffect(() => {
    if (complianceOfficerChoice == "Same as Company Secretary") {
      // setValue("companySecretary", {});
      setValue("complianceOfficer", {});
    }
  }, [complianceOfficerChoice]);

  useEffect(() => {
    if (
      billingAddressChoice === "Same as Registered Office Address" ||
      billingAddressChoice === "Same as Correspondence Office Address"
    ) {
      setValue("billingAddress", {}); // Reset only if needed
    }
  }, [billingAddressChoice]); // 🔁 Only this is necessary

  // useEffect(() => {
  //   setValue("billingAddressChoice", "Same as Registered Office Address");
  //   setValue("addressChoice", "same");
  // }, []);

  const handleAdd = () => {
    setRows([...rows, { name: "", date: "" }]);
  };

  const handleRemove = () => {
    if (rows.length <= 1) return; // Prevent removing the last remaining row

    const lastIndex = rows.length - 1;

    // Unregister only the last row's inputs
    unregister(`previousNames.${lastIndex}.name`);
    unregister(`previousNames.${lastIndex}.date`);

    // Remove last row from state
    const updatedRows = [...rows];
    updatedRows.pop();
    setRows(updatedRows);
  };

  const handleForm = async (data) => {
    try {
      const res = await axios.post("/api/adddata", data);
      console.log(res.data);
      setloading(true);
      router.push(`/View/${res.data.uniqueId}`);

      toast.success("Submited Successfully");
      // console.log(data);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const companyInformation = [
    {
      label: "Date of Incorporation",
      name: "incorporationDate",
      type: "date",
      required: true,
    },
    {
      label: "Main Business",
      name: "mainBusiness",
      type: "text",
      required: true,
    },
    {
      label: "PAN",
      name: "pan",
      type: "text",
      required: true,
      pattern: {
        value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
        message: "Invalid PAN format",
      },
    },
    {
      label: "TAN",
      name: "tan",
      type: "text",
      required: false,
      pattern: {
        value: /^[A-Z]{4}[0-9]{5}[A-Z]$/,
        message: "Invalid TAN format",
      },
    },
    {
      label: "CIN",
      name: "cin",
      type: "text",
      required: false,
      pattern: {
        value: /^[A-Z0-9]{21}$/,
        message: "CIN must be 21 characters",
      },
    },
    {
      label: "Legal Entity Identifier (LEI)",
      name: "lei",
      type: "text",
      required: false,
      pattern: {
        value: /^[0-9]{20}$/,
        message: "LEI must be 20 digits",
      },
    },
    {
      label: "GSTN",
      name: "gstn",
      type: "text",
      required: false,
      pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: "Invalid GSTN format",
      },
    },
  ];

  const rta = [
    {
      label: "Name",
      value: "Accurate Securities And Registry Private Limited",
    },
    {
      label: "Address-1",
      value: "B 1105-1108 K P Epitome",
    },
    {
      label: "Address-2",
      value: "Near Makarba Lake",
    },
    {
      label: "Address-1",
      value: "Near Siddhi Vinayak Towers, Makarba",
    },
    {
      label: "City",
      value: "AHMEDABAD",
    },
    {
      label: "Pin",
      value: "380051",
    },
    {
      label: "State",
      value: "GUJARAT",
    },
    {
      label: "Phone-1",
      value: "07948000319",
    },
    {
      label: "Email ID",
      value: "isin@accuratesecurities.com",
    },
  ];

  const {
    fields: directors,
    append: addDirector,
    remove: removeDirector,
  } = useFieldArray({
    control,
    name: "directors",
  });
  const {
    fields: promoters,
    append: addPromoter,
    remove: removePromoter,
  } = useFieldArray({
    control,
    name: "promoters",
  });
  return (
    <>
      {loading == true && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "4rem", height: "4rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="container-fluid   py-lg-5 py-3">
        <div className="container p-lg-0 p-0">
          <form
            action=""
            onSubmit={handleSubmit(handleForm)}
            className="form-control p-4 "
          >
            <div className="my-3">
              <h5 className="text-decoration-underline mb-3">
                Letter of Intent cum Master Creation Form for admission of
                Unlisted Company
              </h5>
              <p className="m-0 text-secondary fs-5">
                Kindly ensure that all the columns are properly filled. Write
                "N.A". Wherever not applicable. Fill Up the form in BLOCK
                LETTERS only. Affix stamp and initials in each page of the form
              </p>
            </div>
            {/* date input  */}
            <div className="my-4">
              <input
                type="date"
                required
                {...register("date")}
                className="form-control shadow-none w-auto ms-auto "
              />
            </div>
            <div className="my-4">
              <p className="lh-base">
                <span className="">
                  To,
                  <br />
                  The Managing Director <br />
                  Central Depository Services (India) Limited
                </span>{" "}
                <br />
                A Wing, 25th Floor, Marathon Futurex, <br />
                Mafatlal Mils, Compounds, <br />
                N M Joshi Marg, Lower Parel (E) <br />
                Mumbai - 400013
              </p>
              <p>Dear Sir,</p>
              <p>
                We are interested in offering demat option to our shareholders.
                Kindly admit the securities as per the attached details and
                allot an International Securities Identification Number/s
                (ISIN/s) for the same. We confirm that the information provided
                is true and correct to the best of our knowledge and we will be
                solely responsible for any false or incorrect information or
                failing to furnish the relevant information along with the
                required documents.
              </p>
              <p>The Details of our Company are as given below</p>
            </div>
            {/* part 1  */}
            <ol type="A" className="fw-bold ps-4">
              {/* 1 feild  */}
              <li>
                <div className="my-4">
                  <p className="fw-bold  mb-2">Full Name of the Company : </p>
                  <input
                    required
                    type="text"
                    placeholder="Enter Name of The Company"
                    className="form-control  shadow-none"
                    onChange={(e) => setValue("companyName", e.target.value)}
                    value={companyName}
                  />
                </div>
              </li>
              {/* 2 feild  */}
              <li>
                <div className="my-4">
                  Previous Name (s) of the Company ( Applicable where there
                  is(are) chnage(s) in name(s) of the Company after
                  incorporation) :
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered text-nowrap w-100">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-normal">Sr.No</th>
                          <th className="fw-normal">Previous Name</th>
                          <th className="fw-normal">Date of Name Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <>
                            <tr key={row.id}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  {...register(`previousNames.${index}.name`)}
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Previous Name"
                                />
                              </td>
                              <td>
                                <input
                                  {...register(`previousNames.${index}.date`)}
                                  type="date"
                                  className="form-control shadow-none"
                                />
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>

                    <button
                      type="button"
                      className="btn btn-primary rounded-0 shadow-none mb-3"
                      onClick={handleAdd}
                    >
                      Add Row
                    </button>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        className="btn rounded-0 mb-3 ms-2 btn-danger"
                        onClick={() => handleRemove()}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </li>
              {/* 3 feild  */}
              <li>
                <div className="my-4 ">
                  Company Information
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered text-nowrap w-100">
                      <tbody>
                        {companyInformation.map((field, index) => (
                          <tr key={index}>
                            <td className="align-content-center fw-normal">
                              <label className="form-label">
                                {field.label}
                              </label>
                            </td>
                            <td>
                              <input
                                type={field.type}
                                className="form-control shadow-none"
                                {...register(
                                  `companyInformation.${field.name}`,
                                  {
                                    required: field.required
                                      ? `${field.label} is required`
                                      : false,
                                    pattern: field.pattern,
                                  }
                                )}
                              />
                              {errors[field.name] && (
                                <p className="text-danger small m-0">
                                  {errors[field.name].message}
                                </p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>

              {/* 4 feild  */}
              <li>
                <div className="my-4">
                  Type Of Company ( Put ✅ at the appropriate box.) :
                  <div className="row mt-3">
                    {/* Origin Selection */}
                    <div className="col-lg-6 my-3">
                      <p className="text-uppercase mb-1 fw-normal">
                        Choose One Option :
                      </p>

                      <label className="form-control d-flex justify-content-between  my-2">
                        Indian
                        <input
                          {...register("typeOfCompany.origin", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="indian"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between my-2">
                        MNC
                        <input
                          {...register("typeOfCompany.origin", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="mnc"
                        />
                      </label>

                      {errors?.typeOfCompany?.origin && (
                        <p className="text-danger">
                          {errors.typeOfCompany.origin.message}
                        </p>
                      )}
                    </div>

                    {/* Company Type Selection */}
                    <div className="col-lg-6 my-3">
                      <p className="text-uppercase mb-1 fw-normal">
                        Choose One Option :
                      </p>

                      <label className="form-control d-flex justify-content-between  my-2">
                        Private Limited
                        <input
                          {...register("typeOfCompany.companyType", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="private limited"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between my-2">
                        Public Limited
                        <input
                          {...register("typeOfCompany.companyType", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="public limited"
                        />
                      </label>

                      {/* 🔧 FIXED ERROR DISPLAY */}
                      {errors?.typeOfCompany?.companyType && (
                        <p className="text-danger">
                          {errors.typeOfCompany.companyType.message}
                        </p>
                      )}
                    </div>
                    {/* classification of company  */}
                    <div className="col-lg-6 my-3">
                      <p className="text-uppercase mb-1 fw-normal">
                        Choose One Option :
                      </p>

                      <label className="form-control d-flex justify-content-between  my-2">
                        PSU / Government
                        <input
                          {...register("typeOfCompany.classification", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="PSU / Government"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between my-2">
                        Join Stock Company
                        <input
                          {...register("typeOfCompany.classification", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Join Stock Company"
                        />
                      </label>
                      <label className="form-control d-flex justify-content-between my-2">
                        Statutory Company
                        <input
                          {...register("typeOfCompany.classification", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Statutory Company"
                        />
                      </label>
                      <label className="form-control d-flex justify-content-between my-2">
                        Mutual Fund
                        <input
                          {...register("typeOfCompany.classification", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Mutual Fund"
                        />
                      </label>
                      <label className="form-control d-flex justify-content-between my-2">
                        Guarantee and association Company
                        <input
                          {...register("typeOfCompany.classification", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Guarantee and association Company"
                        />
                      </label>
                      <label className="form-control d-flex justify-content-between my-2">
                        Limited Liability Partnership
                        <input
                          {...register("typeOfCompany.classification", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Limited Liability Partnership"
                        />
                      </label>

                      {/* 🔧 FIXED ERROR DISPLAY */}
                      {errors?.typeOfCompany?.classification && (
                        <p className="text-danger">
                          {errors.typeOfCompany.classification.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              {/* 5 feild  */}
              <li>
                <div className="my-4">
                  Registered Office Address :
                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered  text-nowrap ">
                      <tbody className="">
                        <tr>
                          <th className="bg-light align-content-center">
                            Address
                          </th>
                          <td colSpan={3}>
                            <textarea
                              required
                              {...register("registeredOfficeAddress.address")}
                              placeholder="Enter Address.."
                              className="form-control shadow-none"
                            ></textarea>
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-light align-content-center">
                            City
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.city")}
                              required
                              type="text"
                              className="form-control shadow-none"
                              placeholder="Enter City"
                            />
                          </td>
                          <th className="align-content-center  bg-light ">
                            PIN
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.pin")}
                              required
                              type="number"
                              className="form-control shadow-none"
                              placeholder="Enter PIN"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-light align-content-center">
                            State
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.state")}
                              required
                              type="text"
                              className="form-control shadow-none"
                              placeholder="Enter State"
                            />
                          </td>
                          <th className="align-content-center  bg-light ">
                            Country
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.country")}
                              required
                              type="text"
                              className="form-control shadow-none"
                              placeholder="Enter Country"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-light align-content-center">
                            Phone-1
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.phone1")}
                              type="number"
                              className="form-control shadow-none"
                              placeholder="Enter Phone-1"
                            />
                          </td>
                          <th className="align-content-center  bg-light ">
                            Phone-2
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.phone2")}
                              type="number"
                              className="form-control shadow-none"
                              placeholder="Enter Phone-2"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-light align-content-center">FAX</th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.fax")}
                              type="text"
                              className="form-control shadow-none"
                              placeholder="Enter Fax"
                            />
                          </td>
                          <th className="align-content-center  bg-light ">
                            Mobile
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.mobile")}
                              type="text"
                              className="form-control shadow-none"
                              placeholder="Enter Mobile"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="bg-light align-content-center">
                            Alternate Mobile
                          </th>
                          <td>
                            <input
                              {...register(
                                "registeredOfficeAddress.alternateMobile"
                              )}
                              type="number"
                              className="form-control shadow-none"
                              placeholder="Enter Alternate Mobile"
                            />
                          </td>
                          <th className="align-content-center  bg-light ">
                            Email-Id
                          </th>
                          <td>
                            <input
                              {...register("registeredOfficeAddress.email")}
                              required
                              type="email"
                              className="form-control shadow-none"
                              placeholder="Enter Email-Id"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center  bg-light ">
                            Alternate Email-Id
                          </th>
                          <td colSpan={4}>
                            <input
                              {...register(
                                "registeredOfficeAddress.alternateEmail"
                              )}
                              type="email"
                              className="form-control shadow-none"
                              placeholder="Enter Alternate Email-Id"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>

              {/* 6 feild  */}
              <li>
                <div className="my-4">
                  <p className="text-wrap text-break m-0">
                    Administrative/Corporate. Correspondence Office Address (Put
                    ✅ at the appropriate box):
                  </p>

                  <div className="row mt-3">
                    <div className="col-lg-6 ">
                      {/* <p className="text-uppercase mb-1 fw-normal">Choose One Option :</p> */}

                      <label className="form-control d-flex justify-content-between  my-2">
                        Same as Registered Office Address
                        <input
                          {...register("addressChoice", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="same"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between my-2">
                        Other Address ( if any )
                        <input
                          {...register("addressChoice", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="other"
                        />
                      </label>

                      {errors?.addressChoice && (
                        <p className="text-danger">
                          {errors.addressChoice.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  Correspondence Office Address :
                  {addressChoice === "other" ? (
                    <>
                      <div className="overflow-x-auto custom mt-3">
                        <table className="table table-bordered  text-nowrap ">
                          <tbody className="">
                            <tr>
                              <th className="bg-light align-content-center">
                                Address
                              </th>
                              <td colSpan={3}>
                                <textarea
                                  required
                                  {...register(
                                    "correspondenceOfficeAddress.address"
                                  )}
                                  placeholder="Enter Address.."
                                  className="form-control shadow-none"
                                ></textarea>
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                City
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.city"
                                  )}
                                  required
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter City"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                PIN
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.pin"
                                  )}
                                  required
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter PIN"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                State
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.state"
                                  )}
                                  required
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter State"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Country
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.country"
                                  )}
                                  required
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Country"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                Phone-1
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.phone1"
                                  )}
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter Phone-1"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Phone-2
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.phone2"
                                  )}
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter Phone-2"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                FAX
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.fax"
                                  )}
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Fax"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Mobile
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.mobile"
                                  )}
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Mobile"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                Alternate Mobile
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.alternateMobile"
                                  )}
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter Alternate Mobile"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Email-Id
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.email"
                                  )}
                                  required
                                  type="email"
                                  className="form-control shadow-none"
                                  placeholder="Enter Email-Id"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="align-content-center  bg-light ">
                                Alternate Email-Id
                              </th>
                              <td colSpan={4}>
                                <input
                                  {...register(
                                    "correspondenceOfficeAddress.alternateEmail"
                                  )}
                                  type="email"
                                  className="form-control shadow-none"
                                  placeholder="Enter Alternate Email-Id"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : addressChoice === "same" ? (
                    <>
                      <span className="fw-normal ps-2 text-sm">
                        Same as Registered Office
                      </span>
                    </>
                  ) : null}
                </div>
              </li>

              {/* 7 feild  */}
              <li>
                <div className="my-4">
                  Billing Address (Put ✅ at the appropriate box) :
                  <div className="row mt-3">
                    <div className="col-lg-6 ">
                      {/* <p className="text-uppercase mb-1 fw-normal">Choose One Option :</p> */}

                      <label className="form-control d-flex justify-content-between  my-2">
                        Same as Registered Office Address
                        <input
                          type="radio"
                          {...register("billingAddressChoice")}
                          value="Same as Registered Office Address"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between  my-2">
                        Same as Correspondence Office Address
                        <input
                          type="radio"
                          {...register("billingAddressChoice")}
                          value="Same as Correspondence Office Address"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between  my-2">
                        Other
                        <input
                          type="radio"
                          {...register("billingAddressChoice")}
                          value="other"
                        />
                      </label>

                      {errors?.billingAddressChoice && (
                        <p className="text-danger">
                          {errors.billingAddressChoice.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  Billing Address :
                  {billingAddressChoice === "other" ? (
                    <>
                      <div className="overflow-x-auto custom mt-3">
                        <table className="table table-bordered  text-nowrap ">
                          <tbody className="">
                            <tr>
                              <th className="bg-light align-content-center">
                                Address
                              </th>
                              <td colSpan={3}>
                                <textarea
                                  required
                                  {...register("billingAddress.address")}
                                  placeholder="Enter Address.."
                                  className="form-control shadow-none"
                                ></textarea>
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                City
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.city")}
                                  required
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter City"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                PIN
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.pin")}
                                  required
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter PIN"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                State
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.state")}
                                  required
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter State"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Country
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.country")}
                                  required
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Country"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                Phone-1
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.phone1")}
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter Phone-1"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Phone-2
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.phone2")}
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter Phone-2"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                FAX
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.fax")}
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Fax"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Mobile
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.mobile")}
                                  type="text"
                                  className="form-control shadow-none"
                                  placeholder="Enter Mobile"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-light align-content-center">
                                Alternate Mobile
                              </th>
                              <td>
                                <input
                                  {...register(
                                    "billingAddress.alternateMobile"
                                  )}
                                  type="number"
                                  className="form-control shadow-none"
                                  placeholder="Enter Alternate Mobile"
                                />
                              </td>
                              <th className="align-content-center  bg-light ">
                                Email-Id
                              </th>
                              <td>
                                <input
                                  {...register("billingAddress.email")}
                                  required
                                  type="email"
                                  className="form-control shadow-none"
                                  placeholder="Enter Email-Id"
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="align-content-center  bg-light ">
                                Alternate Email-Id
                              </th>
                              <td colSpan={4}>
                                <input
                                  {...register("billingAddress.alternateEmail")}
                                  type="email"
                                  className="form-control shadow-none"
                                  placeholder="Enter Alternate Email-Id"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : billingAddressChoice ===
                    "Same as Registered Office Address" ? (
                    <>
                      <span className="fw-normal ps-2 text-sm">
                        Same as Registered Office Address
                      </span>
                    </>
                  ) : billingAddressChoice ===
                    "Same as Correspondence Office Address" ? (
                    <>
                      <span className="fw-normal ps-2 text-sm">
                        Same as Correspondence Office Address
                      </span>
                    </>
                  ) : null}
                </div>
              </li>

              {/* 8 feild  */}
              <li>
                <div className="my-4">
                  <p>
                    Details of Board of Directors : (Please clearly identify The
                    Chairman,MD and The Wholetime Director)
                  </p>
                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-normal">Sr.No</th>
                          <th className="fw-normal">Name</th>
                          <th className="fw-normal">
                            Chairman / MD / Wholetime Director
                          </th>
                          <th colSpan={2} className="fw-normal text-center">
                            PAN / DIN
                          </th>
                          {/* <th className="fw-normal">DIN</th> */}
                          <th className="fw-normal">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {directors.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                {...register(`directors.${index}.name`)}
                                className="form-control shadow-none"
                                placeholder="Enter Name"
                              />
                            </td>
                            <td>
                              <select
                                {...register(`directors.${index}.role`)}
                                className="form-select shadow-none"
                              >
                                <option value="">Select</option>
                                <option value="Chairman">Chairman</option>
                                <option value="MD">
                                  Managing Director (MD)
                                </option>
                                <option value="Wholetime Director">
                                  Wholetime Director
                                </option>
                              </select>
                            </td>
                            <td>
                              <input
                                {...register(`directors.${index}.pan`)}
                                className="form-control shadow-none"
                                placeholder="Enter PAN "
                              />
                            </td>
                            <td>
                              <input
                                {...register(`directors.${index}.din`)}
                                className="form-control shadow-none"
                                placeholder="Enter DIN"
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeDirector(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() =>
                      addDirector({ name: "", role: "", pan: "", din: "" })
                    }
                  >
                    Add Row
                  </button>
                </div>
              </li>
              {/* 9 feild  */}
              <li>
                <div className="my-4">
                  <p>Details of Promoters and Key Management Persons</p>
                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-normal">Sr.No</th>
                          <th className="fw-normal">Name</th>
                          <th className="fw-normal">
                            Promoters / Key Managerial Persons
                          </th>
                          <th className="fw-normal">PAN</th>
                          <th className="fw-normal">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promoters.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                {...register(`promoters.${index}.name`)}
                                className="form-control shadow-none"
                                placeholder="Enter Name"
                              />
                            </td>
                            <td>
                              <input
                                {...register(`promoters.${index}.details`)}
                                className="form-control shadow-none"
                                placeholder="Enter Details"
                              />
                            </td>
                            <td>
                              <input
                                {...register(`promoters.${index}.pan`)}
                                className="form-control shadow-none"
                                placeholder="Enter PAN "
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removePromoter(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() =>
                      addPromoter({ name: "", details: "", pan: "" })
                    }
                  >
                    Add Row
                  </button>
                </div>
              </li>

              {/* 10 feild  */}
              <li>
                <div className="my-4">
                  <p>Particulars of The Company Secretary : </p>
                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <tbody>
                        <tr>
                          <th className="align-content-center bg-light">
                            Name
                          </th>
                          <td colSpan={3}>
                            <input
                              type="text"
                              placeholder="Enter Name"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.name")}
                              required
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">
                            Employee
                          </th>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter Employee"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.employee")}
                            />
                          </td>
                          <th className="align-content-center bg-light">
                            Practicing
                          </th>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter Practicing"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.practicing")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">
                            CS Registration Number
                          </th>
                          <td colSpan={3}>
                            <input
                              type="text"
                              placeholder="Enter CS Registration Number "
                              className="form-control shadow-none"
                              {...register("comapnySecretary.cs")}
                              required
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">
                            Designation [if Employee]
                          </th>
                          <td colSpan={3}>
                            <input
                              type="text"
                              placeholder="Enter Designation [if Employee] "
                              className="form-control shadow-none"
                              {...register("comapnySecretary.designation")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">
                            Phone - 1
                          </th>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter Phone - 1"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.phone1")}
                            />
                          </td>
                          <th className="align-content-center bg-light">
                            Phone - 2
                          </th>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter Phone - 2"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.phone2")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">FAX</th>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter Fax"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.fax")}
                            />
                          </td>
                          <th className="align-content-center bg-light">
                            Mobile
                          </th>
                          <td>
                            <input
                              type="number"
                              placeholder="Enter Mobile"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.mobile")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">PAN</th>
                          <td colSpan={3}>
                            <input
                              type="text"
                              placeholder="Enter PAN"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.pan")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-content-center bg-light">
                            Email ID
                          </th>
                          <td colSpan={3}>
                            <input
                              type="text"
                              placeholder="Enter Email Id"
                              className="form-control shadow-none"
                              {...register("comapnySecretary.email")}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3">
                    <div className="row">
                      <div className="col-12">
                        <p className="fw-bold  fw-normal">
                          Particulars of the Compliance Officer ( put ✅ at the
                          appropriate box ) :
                        </p>
                      </div>
                      <div className="col-lg-6 ">
                        <label className="form-control d-flex justify-content-between  my-2">
                          Same as Company Secretary
                          <input
                            {...register("complianceOfficerChoice", {
                              required: "Please select One Option",
                            })}
                            type="radio"
                            value="Same as Company Secretary"
                          />
                        </label>

                        <label className="form-control d-flex justify-content-between my-2">
                          Other Personal (if any)
                          <input
                            {...register("complianceOfficerChoice", {
                              required: "Please select One Option",
                            })}
                            type="radio"
                            value="other"
                          />
                        </label>

                        {errors?.complianceOfficerChoice && (
                          <p className="text-danger">
                            {errors.complianceOfficerChoice.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="overflow-x-auto custom mt-3">
                      {complianceOfficerChoice === "other" ? (
                        <>
                          Other Personal (Applicable if ticked on other
                          Personnel) :
                          <table className="table table-bordered mt-2 text-nowrap">
                            <tbody>
                              <tr>
                                <th className="align-content-center bg-light">
                                  Name
                                </th>
                                <td colSpan={3}>
                                  <input
                                    type="text"
                                    placeholder="Enter Name"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.name")}
                                    required
                                  />
                                </td>
                              </tr>

                              <tr>
                                <th className="align-content-center bg-light">
                                  Designation
                                </th>
                                <td colSpan={3}>
                                  <input
                                    type="text"
                                    placeholder="Enter Designation [if Employee] "
                                    className="form-control shadow-none"
                                    {...register(
                                      "complianceOfficer.designation"
                                    )}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th className="align-content-center bg-light">
                                  Phone - 1
                                </th>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Phone - 1"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.phone1")}
                                  />
                                </td>
                                <th className="align-content-center bg-light">
                                  Phone - 2
                                </th>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Phone - 2"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.phone2")}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th className="align-content-center bg-light">
                                  FAX
                                </th>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Enter Fax"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.fax")}
                                  />
                                </td>
                                <th className="align-content-center bg-light">
                                  Mobile
                                </th>
                                <td>
                                  <input
                                    type="number"
                                    placeholder="Enter Mobile"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.mobile")}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th className="align-content-center bg-light">
                                  PAN
                                </th>
                                <td colSpan={3}>
                                  <input
                                    type="text"
                                    placeholder="Enter PAN"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.pan")}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th className="align-content-center bg-light">
                                  Email ID
                                </th>
                                <td colSpan={3}>
                                  <input
                                    type="text"
                                    placeholder="Enter Email Id"
                                    className="form-control shadow-none"
                                    {...register("complianceOfficer.email")}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <>
                          <p className="fw-bold">
                            {" "}
                            Compliance Officer :{" "}
                            <span className="fw-normal">
                              Same as Company Secretary
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <p>Register & Transfer ( R & T ) Work of the Company :</p>
                <div className="">
                  <p>Register and Transfer Agent (RTA) Details : </p>
                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <tbody>
                        {rta.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <th className="bg-light">{item.label}</th>
                                <td className="fw-normal">{item.value}</td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p>Type of Service (Put ✅ at the appropriate ) :</p>
                  <div className="row">
                    <div className="col-lg-6 ">
                      <label className="form-control d-flex justify-content-between  my-2">
                        Single Point Connectivity [Physical + Electronic]
                        <input
                          {...register("service", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Single Point Connectivity [Physical + Electronic]"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between my-2">
                        Only Electronic Connectivity
                        <input
                          {...register("service", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="Only Electronic Connectivity"
                        />
                      </label>

                      {errors?.service && (
                        <p className="text-danger">{errors.service.message}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-3">
                    Physical RTA Details (if if ticked on "Only Electronic
                    Connectivity):
                  </p>
                  <p className="text-muted">
                    [Address of the Registry operations Where the Physical
                    securities for dematerialisation / rematerialization are to
                    be delivered byn the Depository Participants]
                  </p>
                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <tbody>
                        {rta.map((item, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <th className="bg-light">{item.label}</th>
                                <td className="fw-normal">{item.value}</td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
            </ol>
            {/* part 2  */}
            <div className="my-4 fw-bold text-center fs-4 border-top pt-4 border-3 border-black">
              <p>Particulars of Equity Shares to be admitted with CDSL</p>
              <p>(Part - B)</p>
            </div>
            <ol type="A" className="fw-bold ps-4 ">
              {/* 1 feild  */}
              <li>
                <div className="my-4">
                  <p className="fw-bold  mb-2">
                    Name of the issuing Company :{" "}
                  </p>
                  <input
                    required
                    type="text"
                    placeholder="Enter Name of The Company"
                    className="form-control  shadow-none"
                    onChange={(e) => setValue("companyName", e.target.value)}
                    value={companyName}
                  />
                </div>
              </li>
              {/* 2 feild  */}
              <li>
                <div className="my-4">
                  <p className="mb-2">
                    Name of the share dept./ R&TA having electronic Connectivity
                    with CDSL
                  </p>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Enter Name Of Share"
                    {...register("nameOfShare")}
                  />
                </div>
              </li>
              {/* 3 feild  */}
              <li>
                <div className="my-4">
                  <div className="mb-2">Type Of Security</div>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Enter Type Of Security"
                    {...register("typeOfSecurity")}
                  />
                </div>
                <div className="my-4">
                  <p>
                    Whether any Other Security of the company is already
                    available in dematerialsed form :{" "}
                  </p>
                  <div className="row">
                    <div className="col-lg-6 ">
                      {/* <p className="text-uppercase mb-1 fw-normal">Choose One Option :</p> */}

                      <label className="form-control d-flex justify-content-between  my-2">
                        Yes
                        <input
                          {...register("otherSecurity", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="yes"
                        />
                      </label>

                      <label className="form-control d-flex justify-content-between my-2">
                        No
                        <input
                          {...register("otherSecurity", {
                            required: "Please select One Option",
                          })}
                          type="radio"
                          value="no"
                        />
                      </label>

                      {errors?.addressChoice && (
                        <p className="text-danger">
                          {errors.addressChoice.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {otherSecurity === "yes" && (
                    <>
                      <p className="my-2">Enter ISIN Number : </p>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        placeholder="Enter ISIN"
                        {...register("isin")}
                      />
                    </>
                  )}
                </div>
              </li>

              {/* 4 feild  */}
              <li>
                <div className="my-4">
                  <p>
                    Particulars of Equity Capital as on Previous Financial year
                    end 31.03.2024
                  </p>

                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Shares Capital</th>
                          <th>No of Shares</th>
                          <th>Face Value per share</th>
                          <th>Paid-up value per share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Authorised */}
                        <tr>
                          <th>Authorised</th>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "equityCapital.authorised.noOfShares"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter Number of Shares"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "equityCapital.authorised.faceValue"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter Face Value per Share"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "equityCapital.authorised.paidUpValue"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter Paid-up Value per share"
                            />
                          </td>
                        </tr>

                        {/* Issued */}
                        <tr>
                          <th>Issued</th>
                          <td>
                            <input
                              type="number"
                              {...register("equityCapital.issued.noOfShares")}
                              className="form-control shadow-none"
                              placeholder="Enter No. of Shares"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register("equityCapital.issued.faceValue")}
                              className="form-control shadow-none"
                              placeholder="Enter Face Value per Share"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register("equityCapital.issued.paidUpValue")}
                              className="form-control shadow-none"
                              placeholder="Enter Paid-up Value per share"
                            />
                          </td>
                        </tr>

                        {/* Paid Up */}
                        <tr>
                          <th>Paid up</th>
                          <td>
                            <input
                              type="number"
                              {...register("equityCapital.paidUp.noOfShares")}
                              className="form-control shadow-none"
                              placeholder="Enter No. of Shares"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register("equityCapital.paidUp.faceValue")}
                              className="form-control shadow-none"
                              placeholder="Enter Face Value per Share"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register("equityCapital.paidUp.paidUpValue")}
                              className="form-control shadow-none"
                              placeholder="Enter Paid-up Value per share"
                            />
                          </td>
                        </tr>

                        {/* Difference if any */}
                        <tr>
                          <th>Difference if any</th>
                          <td className="text-center fw-bold">
                            {issuedShares && paidUpShares
                              ? difference
                              : "[A - B]"}
                          </td>
                          <td className="text-muted text-center">-</td>
                          <td className="text-muted text-center">-</td>
                        </tr>

                        {/* Distinctive Nos */}
                        <tr>
                          <th>Distinctive Nos.</th>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "equityCapital.distinctive.noOfShares"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter No of shares"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "equityCapital.distinctive.faceValue"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter Face Value per Share"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "equityCapital.distinctive.paidUpValue"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter Paid-up Value per share"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Smart Conditions: Warnings and Extras */}
                  {paidUpShareWarning && (
                    <p className="text-danger mt-2">
                      ⚠️ Paid-up shares cannot exceed Issued shares.
                    </p>
                  )}
                  {paidUpValueWarning && (
                    <p className="text-danger">
                      ⚠️ Paid-up value per share cannot exceed Face value.
                    </p>
                  )}
                  {showExtraNotes && (
                    <div className="mt-3">
                      <label>Note for High Authorised Capital:</label>
                      <textarea
                        {...register("equityCapital.notes")}
                        className="form-control"
                        placeholder="Explain why authorised capital is over 10 lakh"
                      />
                    </div>
                  )}
                </div>
                <div className="my-4">
                  <p className="mb-2">
                    Reason for Differencce of Shares, if applicable [A-b]
                  </p>
                  <input
                    type="text"
                    placeholder="Write Reason.."
                    className="form-control shadow-none"
                    {...register("reasonForDiffOfShare")}
                  />
                </div>
              </li>

              {/* 5 feild  */}
              <li>
                <div className="my-4">
                  <p>
                    Details of New Shares Issued During the Current Financial
                    Year <br />
                    Year of The Company: DD/MM/YYYY
                  </p>

                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Nature of Issue</th>
                          <th>No. of Shares</th>
                          <th>Date of Allotment</th>
                          <th>Face Value/Share</th>
                          <th>Fully Paid</th>
                          <th>Partly Paid</th>
                          <th>Distinctive Nos.</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issueFields.map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              <select
                                {...register(
                                  `issuedSharesCurrentYear.${index}.nature`
                                )}
                                className="form-select shadow-none"
                              >
                                <option value="">Select</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Rights">Rights</option>
                                <option value="Public Offer">
                                  Public Offer
                                </option>
                                <option value="Partly Paid-up">
                                  Partly Paid-up
                                </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                {...register(
                                  `issuedSharesCurrentYear.${index}.noOfShares`
                                )}
                                className="form-control shadow-none"
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                {...register(
                                  `issuedSharesCurrentYear.${index}.date`
                                )}
                                className="form-control shadow-none"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                {...register(
                                  `issuedSharesCurrentYear.${index}.faceValue`
                                )}
                                className="form-control shadow-none"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                {...register(
                                  `issuedSharesCurrentYear.${index}.fullyPaid`
                                )}
                                className="form-control shadow-none"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                {...register(
                                  `issuedSharesCurrentYear.${index}.partlyPaid`
                                )}
                                className="form-control shadow-none"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                {...register(
                                  `issuedSharesCurrentYear.${index}.distinctiveNos`
                                )}
                                className="form-control shadow-none"
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => removeIssue(index)}
                                className="btn btn-danger btn-sm"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Totals Row */}
                        <tr className="fw-bold bg-light">
                          <td>Total</td>
                          <td>{totalIssuedShares}</td>
                          <td></td>
                          <td>{totalFaceValueIssued}</td>
                          <td colSpan="4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary "
                    onClick={() =>
                      appendIssue({
                        nature: "",
                        noOfShares: "",
                        date: "",
                        faceValue: "",
                        fullyPaid: "",
                        partlyPaid: "",
                        distinctiveNos: "",
                      })
                    }
                  >
                    Add Row
                  </button>
                </div>
              </li>

              {/* 6 feild  */}
              <li>
                <div className="my-4">
                  <p className="fw-bold">Shareholding Pattern</p>

                  <div className="overflow-x-auto custom mt-3">
                    <table className="table table-bordered text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Type of Holding</th>
                          <th>No. of Shareholders</th>
                          <th>No. of Shares Held</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Promoters */}
                        <tr>
                          <td>Promoters’ Holdings</td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "shareholding.promoters.shareholders"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter No. of Shareholders"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register("shareholding.promoters.sharesHeld")}
                              className="form-control shadow-none"
                              placeholder="Enter No. of Shares"
                            />
                          </td>
                          <td className="text-center">{promoterPercentage}%</td>
                        </tr>

                        {/* Non-Promoters */}
                        <tr>
                          <td>Non-Promoters’ Holdings</td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "shareholding.nonPromoters.shareholders"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter No. of Shareholders"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              {...register(
                                "shareholding.nonPromoters.sharesHeld"
                              )}
                              className="form-control shadow-none"
                              placeholder="Enter No. of Shares"
                            />
                          </td>
                          <td className="text-center">
                            {nonPromoterPercentage}%
                          </td>
                        </tr>

                        {/* Total */}
                        <tr className="fw-bold bg-light">
                          <td>Total</td>
                          <td>
                            {Number(
                              watch("shareholding.promoters.shareholders") || 0
                            ) +
                              Number(
                                watch(
                                  "shareholding.nonPromoters.shareholders"
                                ) || 0
                              )}
                          </td>
                          <td>{totalShares}</td>
                          <td className="text-center">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
              {/* 7 feild  */}
              <li>
                <div className="my-3">
                  <label className="form-label fw-semibold">
                    Number of shareholders holding more than 1% of the capital
                  </label>
                  <input
                    type="number"
                    {...register("shareholding.moreThan1Percent.count", {
                      required: "This field is required",
                      min: { value: 0, message: "Cannot be negative" },
                    })}
                    className="form-control shadow-none"
                    placeholder="Enter number of shareholders"
                  />
                </div>
              </li>
              {/* 8 feild  */}
              <li>
                <div className="my-4">
                  <p>
                    For issue of CFI Codes: <br />
                    Please Provide separate Voting Rights details for:
                  </p>
                </div>

                <div className="overflow-x-auto custom mt-3">
                  <table className="table table-bordered text-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th colSpan={4} className="bg-light text-center">
                          Voting Rights <br />
                          (indicates the kind of voting power conferred to the
                          shareholder) <br />
                          (put ✅ at the appropriate box)
                        </th>
                        <th colSpan={2} className="bg-light text-center">
                          Payment Status <br />
                          (put ✅ at the appropriate box)
                        </th>
                        <th className="bg-light text-center">No of Shares</th>
                        <th className="bg-light text-center">Particulars</th>
                        <th className="bg-light text-center">
                          Paid-up Value per Share
                        </th>
                      </tr>
                      <tr>
                        <th className="text-center">
                          Voting
                          <br />
                          (Each share has one vote)
                        </th>
                        <th className="text-center">
                          Non-voting
                          <br />
                          (No voting rights)
                        </th>
                        <th className="text-center">
                          Restricted voting
                          <br />
                          (1 vote/share)
                        </th>
                        <th className="text-center">
                          Enhanced voting
                          <br />
                          (1 vote/share)
                        </th>
                        <th className="text-center">Partly Paid</th>
                        <th className="text-center">Fully Paid</th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {votingOptions.map((option) => (
                          <td
                            key={option}
                            className="text-center align-content-center"
                          >
                            <input
                              type="checkbox"
                              className="form-check"
                              checked={selectedVoting === option}
                              onChange={() =>
                                setValue(
                                  "cfi.voting",
                                  selectedVoting === option ? "" : option
                                )
                              }
                            />
                          </td>
                        ))}
                        {paymentOptions.map((option) => (
                          <td
                            key={option}
                            className="text-center align-content-center"
                          >
                            <input
                              type="checkbox"
                              className="form-check"
                              checked={selectedPayment === option}
                              onChange={() =>
                                setValue(
                                  "cfi.paymentStatus",
                                  selectedPayment === option ? "" : option
                                )
                              }
                            />
                          </td>
                        ))}
                        <td>
                          <input
                            type="number"
                            {...register("cfi.noOfShares")}
                            className="form-control shadow-none"
                            placeholder="No. of Shares"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            {...register("cfi.particulars")}
                            className="form-control shadow-none"
                            placeholder="Enter particulars"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            {...register("cfi.paidUpValue")}
                            className="form-control shadow-none"
                            placeholder="Paid-up Value"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            </ol>
            <div className="py-4 border-top border-3 border-black mt-5">
              <p className="text-black fw-bold">
                We certify that the paerticulars furnished hereinabove as also
                in the attached documents are true and corrrect.We further
                undertake to inform CDSL, of any change in the capital
                structure,company's particulars,aditions etc.
              </p>
              <div className="row">
                <div className="col-lg-6 my-2 fw-bold text-black">
                  <p className="mb-1">Place :</p>
                  <input
                    type="text"
                    placeholder="Enter Place"
                    className="form-control shadow-none"
                    {...register("declaration.place")}
                    required
                  />
                </div>
                <div className="col-lg-6 my-2 fw-bold text-black">
                  <p className="mb-1">Name :</p>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="form-control shadow-none"
                    {...register("declaration.name")}
                    required
                  />
                </div>
                <div className="col-lg-6 my-2 fw-bold text-black">
                  <p className="mb-1">Date :</p>
                  <input
                    type="date"
                    className="form-control shadow-none"
                    {...register("declaration.date")}
                    required
                  />
                </div>
                <div className="col-lg-6 my-2 fw-bold text-black">
                  <p className="mb-1">Designation :</p>
                  <input
                    type="text"
                    placeholder="Enter Designation"
                    className="form-control shadow-none"
                    {...register("declaration.designation")}
                    required
                  />
                </div>
              </div>
            </div>
            {/* submit button  */}
            <button className="btn btn-outline-dark form-control shadow-none">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
