"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const View = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("loading");
  const [data, setdata] = useState(); // 'loading' | 'success' | 'error'
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/getone/${id}`);
        if (res.data && res.data.data) {
          setdata(res.data.data);
          console.log(res.data);
          // seteditId(res.data.)

          setStatus("success");
          if (!window._fetchedToastShown) {
            toast.success("Fetched Data");
            window._fetchedToastShown = true;
          }

        } else {
          setStatus("error");
          toast.error("No Data Found");
        }
      } catch (error) {
        console.log(error);
        setStatus("error");
        toast.error("Invalid ID");
      }
    };
    fetch();
  }, [id]);
  const handleGoBack = () => {
    // console.log("hi");
    setStatus("loading")
    router.push("/")

  }
  const handleEdit = () => {
    setStatus("loading")
    sessionStorage.setItem("editId", id);
    router.push("/")


  }
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

  return (
    <>

      {status === "loading" && (
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

      {status === "error" && (
        <p className="text-danger text-center fs-1 my-4">⚠️! Data Not Found</p>
      )}
      {status === "success" && (
        <div className="">
          <div className="container-fluid p-lg-3 p-0 rounded-3">
            <div className="container border p-3 rounded-2 bg-white">
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-success text-center py-4 shadow-sm rounded">
                    <h4 className="alert-heading">🎉 Submission Successful!</h4>
                    <p>
                      Your data has been successfully submitted and saved to our
                      records.
                    </p>
                    <hr />
                    <p className="mb-0">
                      You can now go back to the form or edit the submitted
                      details below.
                    </p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button type="button" className="btn btn-dark px-4" onClick={handleGoBack} >
                      ⬅️ Go Back to Form
                    </button>
                    <button className="btn btn-warning px-4" onClick={handleEdit}>
                      ✏️ Edit Submission
                    </button>
                  </div>
                </div>
              </div>

              <div className="container mt-4 py-4 px-3 bg-white shadow-sm rounded-3 border">
                <div className="row">
                  <div className="col-12">
                    {/* Header Title */}
                    <div className="mb-4 text-center">
                      <h4 className="text-uppercase fw-bold text-decoration-underline">
                        Letter of Intent cum Master Creation Form
                      </h4>
                      <p className="text-muted fst-italic fs-6">
                        for Admission of Unlisted Company
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="alert alert-secondary fs-6 lh-base mb-5">
                      Kindly ensure that all the columns are properly filled.
                      Write <strong>"N.A."</strong> wherever not applicable.
                      Fill up the form in <strong>BLOCK LETTERS</strong> only.
                      Affix stamp and initials on each page of the form.
                    </div>

                    {/* Date */}
                    <div className="text-end text-muted mb-4">
                      <small>
                        <strong>Date:</strong> {data.date}
                      </small>
                    </div>

                    {/* Address Block */}
                    <div className="mb-4">
                      <p className="lh-lg mb-2">
                        <strong>To,</strong>
                        <br />
                        The Managing Director <br />
                        <strong>
                          Central Depository Services (India) Limited
                        </strong>
                        <br />
                        A Wing, 25th Floor, Marathon Futurex,
                        <br />
                        Mafatlal Mills Compound,
                        <br />
                        N M Joshi Marg, Lower Parel (E),
                        <br />
                        Mumbai - 400013
                      </p>
                    </div>

                    {/* Letter Body */}
                    <div className="mb-3 lh-base fs-6">
                      <p>
                        <strong>Dear Sir,</strong>
                      </p>
                      <p>
                        We are interested in offering demat option to our
                        shareholders. Kindly admit the securities as per the
                        attached details and allot an International Securities
                        Identification Number/s (ISIN/s) for the same.
                      </p>
                      <p>
                        We confirm that the information provided is true and
                        correct to the best of our knowledge, and we will be
                        solely responsible for any false or incorrect
                        information or failing to furnish the relevant
                        information along with the required documents.
                      </p>
                      <p>
                        <strong>
                          The details of our company are as given below:
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <ol type="A" className="fw-bold ps-4">
                      <li className="mb-4">
                        <p className="fw-bold mb-2">
                          Full Name of the Company:
                        </p>
                        <p className="form-control-plaintext">
                          {data.companyName}
                        </p>
                      </li>

                      <li className="mb-4">
                        <p className="fw-bold mb-2">
                          Previous Name(s) of the Company (if changed after
                          incorporation):
                        </p>
                        <div className="overflow-x-auto custom">
                          <table className="table table-bordered text-nowrap w-100">
                            <thead className="table-light">
                              <tr>
                                <th>Sr.No</th>
                                <th>Previous Name</th>
                                <th>Date of Name Change</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.previousNames?.map((row, index) => (
                                <tr key={index}>
                                  <td className="fw-normal text-muted">
                                    {index + 1}
                                  </td>
                                  <td className="fw-normal text-muted">
                                    {row.name}
                                  </td>
                                  <td className="fw-normal text-muted">
                                    {row.date}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </li>

                      <li className="mb-4">
                        <p className="fw-bold mb-2">Company Information:</p>
                        <div className="overflow-x-auto custom ">
                          <table className="table table-bordered text-nowrap w-100">
                            <tbody>
                              {Object.entries(
                                data.companyInformation || {}
                              ).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="text-capitalize bg-light">
                                    {key.replace(/([A-Z])/g, " $1")}
                                  </td>
                                  <td className="fw-normal text-center text-muted">
                                    {value == "" ? "-" : value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </li>

                      <li className="mb-4">
                        <p className="fw-bold mb-2">Type of Company:</p>
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td className="bg-light">Origin</td>
                              <td className="text-muted fw-normal text-center">
                                {data.typeOfCompany?.origin}
                              </td>
                            </tr>
                            <tr>
                              <td className="bg-light">Company Type</td>
                              <td className="text-muted fw-normal text-center">
                                {data.typeOfCompany?.companyType}
                              </td>
                            </tr>
                            <tr>
                              <td className="bg-light">Classification</td>
                              <td className="text-muted fw-normal text-center">
                                {data.typeOfCompany?.classification}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Registered Office Address :
                          </h6>
                          <div className="overflow-x-auto custom">
                            <table className="table table-bordered text-nowrap w-100">
                              <tbody>
                                <tr>
                                  <th className="bg-light">Address</th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {data.registeredOfficeAddress?.address}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">City</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.city}
                                  </td>
                                  <th className="bg-light">PIN</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.pin}
                                  </td>
                                </tr>{" "}
                                <tr>
                                  <th className="bg-light">State</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.state}
                                  </td>
                                  <th className="bg-light">Country</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.country}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">Phone-1</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.phone1}
                                  </td>
                                  <th className="bg-light">Phone-2</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.phone2}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">FAX</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.fax}
                                  </td>
                                  <th className="bg-light">Mobile</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.mobile}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">Alternate Mobile</th>
                                  <td className="text-muted fw-normal">
                                    {
                                      data.registeredOfficeAddress
                                        ?.alternateMobile
                                    }
                                  </td>
                                  <th className="bg-light">Email-Id</th>
                                  <td className="text-muted fw-normal">
                                    {data.registeredOfficeAddress?.email}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">
                                    Alternate Email-Id
                                  </th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {
                                      data.registeredOfficeAddress
                                        ?.alternateEmail
                                    }
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Administrative/Corporate Correspondence Office
                            Address:
                          </h6>

                          {data.addressChoice === "same" ? (
                            <p className="ps-2">
                              Same as Registered Office Address
                            </p>
                          ) : (
                            <div className="overflow-x-auto custom">
                              <table className="table table-bordered text-nowrap w-100">
                                <tbody>
                                  <tr>
                                    <th className="bg-light">Address</th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {
                                        data.correspondenceOfficeAddress
                                          ?.address
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">City</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.city}
                                    </td>
                                    <th className="bg-light">PIN</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.pin}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">State</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.state}
                                    </td>
                                    <th className="bg-light">Country</th>
                                    <td className="text-muted fw-normal">
                                      {
                                        data.correspondenceOfficeAddress
                                          ?.country
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">Phone-1</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.phone1}
                                    </td>
                                    <th className="bg-light">Phone-2</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.phone2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">FAX</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.fax}
                                    </td>
                                    <th className="bg-light">Mobile</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.mobile}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">
                                      Alternate Mobile
                                    </th>
                                    <td className="text-muted fw-normal">
                                      {
                                        data.correspondenceOfficeAddress
                                          ?.alternateMobile
                                      }
                                    </td>
                                    <th className="bg-light">Email-Id</th>
                                    <td className="text-muted fw-normal">
                                      {data.correspondenceOfficeAddress?.email}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">
                                      Alternate Email-Id
                                    </th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {
                                        data.correspondenceOfficeAddress
                                          ?.alternateEmail
                                      }
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">Billing Address:</h6>

                          {data.billingAddressChoice ===
                            "Same as Registered Office Address" ? (
                            <p className="ps-2">
                              Same as Registered Office Address
                            </p>
                          ) : data.billingAddressChoice ===
                            "Same as Correspondence Office Address" ? (
                            <p className="ps-2">
                              Same as Correspondence Office Address
                            </p>
                          ) : (
                            <div className="overflow-x-auto custom">
                              <table className="table table-bordered text-nowrap w-100">
                                <tbody>
                                  <tr>
                                    <th className="bg-light">Address</th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {data.billingAddress?.address}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">City</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.city}
                                    </td>
                                    <th className="bg-light">PIN</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.pin}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">State</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.state}
                                    </td>
                                    <th className="bg-light">Country</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.country}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">Phone-1</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.phone1}
                                    </td>
                                    <th className="bg-light">Phone-2</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.phone2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">FAX</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.fax}
                                    </td>
                                    <th className="bg-light">Mobile</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.mobile}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">
                                      Alternate Mobile
                                    </th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.alternateMobile}
                                    </td>
                                    <th className="bg-light">Email-Id</th>
                                    <td className="text-muted fw-normal">
                                      {data.billingAddress?.email}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">
                                      Alternate Email-Id
                                    </th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {data.billingAddress?.alternateEmail}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Details of Board of Directors
                          </h6>
                          <p className="text-muted">
                            (Please clearly identify the Chairman, Managing
                            Director, and Whole-time Director)
                          </p>

                          <div className="overflow-x-auto custom">
                            <table className="table table-bordered text-nowrap">
                              <thead className="table-light">
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Name</th>
                                  <th>Role</th>
                                  <th>PAN</th>
                                  <th>DIN</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.directors?.length > 0 ? (
                                  data.directors.map((director, index) => (
                                    <tr key={index}>
                                      <td className="text-muted fw-normal">
                                        {index + 1}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {director.name || "-"}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {director.role || "-"}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {director.pan || "-"}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {director.din || "-"}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="text-center text-muted"
                                    >
                                      No director data available.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Details of Promoters and Key Management Persons
                          </h6>
                          <div className="overflow-x-auto custom">
                            <table className="table table-bordered text-nowrap">
                              <thead className="table-light">
                                <tr>
                                  <th>Sr. No</th>
                                  <th>Name</th>
                                  <th>Role / Details</th>
                                  <th>PAN</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.promoters?.length > 0 ? (
                                  data.promoters.map((person, index) => (
                                    <tr key={index}>
                                      <td className="text-muted fw-normal">
                                        {index + 1}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {person.name || "-"}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {person.details || "-"}
                                      </td>
                                      <td className="text-muted fw-normal">
                                        {person.pan || "-"}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="text-center text-muted"
                                    >
                                      No promoter or key person data available.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Particulars of The Company Secretary
                          </h6>
                          <div className="overflow-x-auto custom ">
                            <table className="table table-bordered text-nowrap">
                              <tbody>
                                <tr>
                                  <th className="bg-light">Name</th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {data?.comapnySecretary?.name || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">Employee</th>
                                  <td className="text-muted fw-normal">
                                    {data?.comapnySecretary?.employee || "-"}
                                  </td>
                                  <th className="bg-light">Practicing</th>
                                  <td className="text-muted fw-normal">
                                    {data?.comapnySecretary?.practicing || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">
                                    CS Registration Number
                                  </th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {data?.comapnySecretary?.cs || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">
                                    Designation [if Employee]
                                  </th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {data?.comapnySecretary?.designation || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">Phone - 1</th>
                                  <td className="text-muted fw-normal">
                                    {data?.comapnySecretary?.phone1 || "-"}
                                  </td>
                                  <th className="bg-light">Phone - 2</th>
                                  <td className="text-muted fw-normal">
                                    {data?.comapnySecretary?.phone2 || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">FAX</th>
                                  <td className="text-muted fw-normal">
                                    {data?.comapnySecretary?.fax || "-"}
                                  </td>
                                  <th className="bg-light">Mobile</th>
                                  <td className="text-muted fw-normal">
                                    {data?.comapnySecretary?.mobile || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">PAN</th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {data?.comapnySecretary?.pan || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="bg-light">Email ID</th>
                                  <td
                                    className="text-muted fw-normal"
                                    colSpan={3}
                                  >
                                    {data?.comapnySecretary?.email || "-"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <h6 className="fw-bold mt-4 mb-2">
                            Particulars of the Compliance Officer
                          </h6>
                          {data?.complianceOfficerChoice ===
                            "Same as Company Secretary" ? (
                            <p className="ps-2 fw-normal">
                              Same as Company Secretary
                            </p>
                          ) : (
                            <div className="overflow-x-auto custom">
                              <table className="table table-bordered text-nowrap mt-2">
                                <tbody>
                                  <tr>
                                    <th className="bg-light">Name</th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {data?.complianceOfficer?.name || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">Designation</th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {data?.complianceOfficer?.designation ||
                                        "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">Phone - 1</th>
                                    <td className="text-muted fw-normal">
                                      {data?.complianceOfficer?.phone1 || "-"}
                                    </td>
                                    <th className="bg-light">Phone - 2</th>
                                    <td className="text-muted fw-normal">
                                      {data?.complianceOfficer?.phone2 || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">FAX</th>
                                    <td className="text-muted fw-normal">
                                      {data?.complianceOfficer?.fax || "-"}
                                    </td>
                                    <th className="bg-light">Mobile</th>
                                    <td className="text-muted fw-normal">
                                      {data?.complianceOfficer?.mobile || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">PAN</th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {data?.complianceOfficer?.pan || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="bg-light">Email ID</th>
                                    <td
                                      className="text-muted fw-normal"
                                      colSpan={3}
                                    >
                                      {data?.complianceOfficer?.email || "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Register & Transfer (R & T) Work of the Company
                          </h6>

                          <p className="fw-semibold">
                            Register and Transfer Agent (RTA) Details:
                          </p>
                          <div className="overflow-x-auto custom">
                            <table className="table table-bordered text-nowrap">
                              <tbody>
                                {rta.map((item, index) => (
                                  <tr key={index}>
                                    <th className="bg-light">{item.label}</th>
                                    <td className="text-muted fw-normal">
                                      {item.value || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <p className="fw-semibold mt-2">Type of Service:</p>
                          <p className="ps-2 fw-normal">
                            ✅ {data?.service || "Not specified"}
                          </p>

                          {data?.service === "Only Electronic Connectivity" && (
                            <>
                              <p className="fw-semibold mt-4">
                                Physical RTA Details (Applicable if ticked on
                                "Only Electronic Connectivity"):
                              </p>
                              <p className="text-muted small mb-2">
                                [Address of the registry operations where the
                                physical securities for dematerialisation /
                                rematerialisation are to be delivered by the
                                Depository Participants]
                              </p>
                              <div className="overflow-x-auto custom">
                                <table className="table table-bordered text-nowrap">
                                  <tbody>
                                    {rta.map((item, index) => (
                                      <tr key={`physical-${index}`}>
                                        <th className="bg-light">
                                          {item.label}
                                        </th>
                                        <td className="text-muted fw-normal">
                                          {item.value || "-"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    </ol>
                    {/* part 2  */}
                    {/* Part 2 */}
                    <div className="my-5 pt-4 border-top border-3 border-dark text-center">
                      <h5 className="fw-bold mb-1">
                        Particulars of Equity Shares to be admitted with CDSL
                      </h5>
                      <p className="text-secondary fs-5">(Part - B)</p>
                    </div>
                    <ol type="A" className="fw-bold ps-4 ">
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Name of the Issuing Company
                          </h6>
                          <p className=" text-muted fw-normal">
                            {data?.companyName || "-"}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Name of the Share Dept./R&TA having electronic
                            connectivity with CDSL
                          </h6>
                          <p className="text-muted fw-normal">
                            {data?.nameOfShare || "-"}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">Type of Security</h6>
                          <p className="text-muted fw-normal">
                            {data?.typeOfSecurity || "-"}
                          </p>

                          <h6 className="fw-bold mt-4">
                            Whether any other security is already available in
                            dematerialised form:
                          </h6>
                          <p className="text-muted fw-normal">
                            ✅ {data?.otherSecurity === "yes" ? "Yes" : "No"}
                          </p>
                          {data?.otherSecurity === "yes" && (
                            <p className="ps-4 text-muted fw-normal">
                              <strong>ISIN:</strong> {data?.isin || "N/A"}
                            </p>
                          )}
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">
                            Particulars of Equity Capital as on 31.03.2024
                          </h6>
                          <div className="overflow-x-auto custom">
                            <table className="table table-bordered text-nowrap">
                              <thead className="table-light">
                                <tr>
                                  <th>Shares Capital</th>
                                  <th>No of Shares</th>
                                  <th>Face Value per Share</th>
                                  <th>Paid-up Value per Share</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  "authorised",
                                  "issued",
                                  "paidUp",
                                  "distinctive",
                                ].map((type) => (
                                  <tr key={type}>
                                    <th className="text-capitalize">{type}</th>
                                    <td className="text-muted fw-normal">
                                      {data?.equityCapital?.[type]
                                        ?.noOfShares || "-"}
                                    </td>
                                    <td className="text-muted fw-normal">
                                      {data?.equityCapital?.[type]?.faceValue ||
                                        "-"}
                                    </td>
                                    <td className="text-muted fw-normal">
                                      {data?.equityCapital?.[type]
                                        ?.paidUpValue || "-"}
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <th>Difference if any</th>
                                  <td className="fw-bold text-center text-success">
                                    {data?.equityCapital?.issued?.noOfShares &&
                                      data?.equityCapital?.paidUp?.noOfShares
                                      ? Number(
                                        data.equityCapital.issued.noOfShares
                                      ) -
                                      Number(
                                        data.equityCapital.paidUp.noOfShares
                                      )
                                      : "-"}
                                  </td>
                                  <td className="text-muted text-center">-</td>
                                  <td className="text-muted text-center">-</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {data?.equityCapital?.notes && (
                            <div className="mt-3">
                              <strong>Note:</strong>
                              <p className="ps-2 text-muted fw-normal">
                                {data.equityCapital.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="my-4">
                          <h6 className="fw-bold mb-2">
                            Reason for Difference of Shares (if applicable)
                          </h6>
                          <p className="text-muted fw-normal">
                            {data?.reasonForDiffOfShare || "N/A"}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-2">
                            Details of New Shares Issued During the Current
                            Financial Year
                          </h6>
                          <p className="text-muted">
                            (Include year of the company in DD/MM/YYYY format
                            where applicable)
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
                                </tr>
                              </thead>
                              <tbody>
                                {data?.issuedSharesCurrentYear?.length > 0 ? (
                                  data.issuedSharesCurrentYear.map(
                                    (item, index) => (
                                      <tr key={index}>
                                        <td className="text-muted fw-normal">
                                          {item.nature || "-"}
                                        </td>
                                        <td className="text-muted fw-normal">
                                          {item.noOfShares || "-"}
                                        </td>
                                        <td className="text-muted fw-normal">
                                          {item.date
                                            ? new Date(
                                              item.date
                                            ).toLocaleDateString("en-GB")
                                            : "-"}
                                        </td>
                                        <td className="text-muted fw-normal">
                                          {item.faceValue || "-"}
                                        </td>
                                        <td className="text-muted fw-normal">
                                          {item.fullyPaid || "-"}
                                        </td>
                                        <td className="text-muted fw-normal">
                                          {item.partlyPaid || "-"}
                                        </td>
                                        <td className="text-muted fw-normal">
                                          {item.distinctiveNos || "-"}
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="7"
                                      className="text-center text-muted"
                                    >
                                      No new shares issued.
                                    </td>
                                  </tr>
                                )}

                                {/* Totals Row */}
                                <tr className="fw-bold bg-light">
                                  <td>Total</td>
                                  <td>
                                    {data?.issuedSharesCurrentYear?.reduce(
                                      (sum, i) =>
                                        sum + (Number(i.noOfShares) || 0),
                                      0
                                    )}
                                  </td>
                                  <td></td>
                                  <td>
                                    {data?.issuedSharesCurrentYear?.reduce(
                                      (sum, i) =>
                                        sum + (Number(i.faceValue) || 0),
                                      0
                                    )}
                                  </td>
                                  <td colSpan="3"></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <h6 className="fw-bold mb-3">Shareholding Pattern</h6>

                          <div className="overflow-x-auto custom">
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
                                  <td className="text-muted fw-normal">
                                    {data?.shareholding?.promoters
                                      ?.shareholders || 0}
                                  </td>
                                  <td className="text-muted fw-normal">
                                    {data?.shareholding?.promoters
                                      ?.sharesHeld || 0}
                                  </td>
                                  <td className="text-muted fw-normal text-center">
                                    {data?.shareholding?.totalShares
                                      ? (
                                        (Number(
                                          data.shareholding.promoters
                                            .sharesHeld || 0
                                        ) /
                                          Number(
                                            data.shareholding.totalShares || 1
                                          )) *
                                        100
                                      ).toFixed(2) + "%"
                                      : "-"}
                                  </td>
                                </tr>

                                {/* Non-Promoters */}
                                <tr>
                                  <td>Non-Promoters’ Holdings</td>
                                  <td className="text-muted fw-normal">
                                    {data?.shareholding?.nonPromoters
                                      ?.shareholders || 0}
                                  </td>
                                  <td className="text-muted fw-normal">
                                    {data?.shareholding?.nonPromoters
                                      ?.sharesHeld || 0}
                                  </td>
                                  <td className="text-center">
                                    {data?.shareholding?.totalShares
                                      ? (
                                        (Number(
                                          data.shareholding.nonPromoters
                                            .sharesHeld || 0
                                        ) /
                                          Number(
                                            data.shareholding.totalShares || 1
                                          )) *
                                        100
                                      ).toFixed(2) + "%"
                                      : "-"}
                                  </td>
                                </tr>

                                {/* Total */}
                                <tr className="fw-bold bg-light">
                                  <td>Total</td>
                                  <td>
                                    {Number(
                                      data?.shareholding?.promoters
                                        ?.shareholders || 0
                                    ) +
                                      Number(
                                        data?.shareholding?.nonPromoters
                                          ?.shareholders || 0
                                      )}
                                  </td>
                                  <td>
                                    {data?.shareholding?.totalShares || 0}
                                  </td>
                                  <td className="text-center">100%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="my-3">
                          <label className="form-label fw-semibold">
                            Number of shareholders holding more than 1% of the
                            capital
                          </label>
                          <div className="form-control bg-light border border-1 shadow-sm">
                            {data?.shareholding?.moreThan1Percent?.count ??
                              "N/A"}
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="my-4">
                          <p className="fw-semibold">
                            For issue of CFI Codes: <br />
                            Please Provide separate Voting Rights details for:
                          </p>

                          <div className="overflow-x-auto custom mt-3">
                            <table className="table table-bordered text-nowrap">
                              <thead className="table-light">
                                <tr>
                                  <th
                                    colSpan={4}
                                    className="bg-light text-center"
                                  >
                                    Voting Rights <br />
                                    (indicates the kind of voting power
                                    conferred to the shareholder) <br />
                                    (put ✅ at the appropriate box)
                                  </th>
                                  <th
                                    colSpan={2}
                                    className="bg-light text-center"
                                  >
                                    Payment Status <br />
                                    (put ✅ at the appropriate box)
                                  </th>
                                  <th className="bg-light text-center">
                                    No of Shares
                                  </th>
                                  <th className="bg-light text-center">
                                    Particulars
                                  </th>
                                  <th className="bg-light text-center">
                                    Paid-up Value per Share
                                  </th>
                                </tr>
                                <tr>
                                  <th className="text-center">Voting</th>
                                  <th className="text-center">Non-voting</th>
                                  <th className="text-center">
                                    Restricted voting
                                  </th>
                                  <th className="text-center">
                                    Enhanced voting
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
                                  {/* Voting Rights (show tick where matched) */}
                                  {[
                                    "voting",
                                    "nonVoting",
                                    "restrictedVoting",
                                    "enhancedVoting",
                                  ].map((opt) => (
                                    <td
                                      key={opt}
                                      className="text-center align-middle"
                                    >
                                      {data?.cfi?.voting === opt ? "✅" : "-"}
                                    </td>
                                  ))}

                                  {/* Payment Status */}
                                  {["partlyPaid", "fullyPaid"].map((opt) => (
                                    <td
                                      key={opt}
                                      className="text-center align-middle"
                                    >
                                      {data?.cfi?.paymentStatus === opt
                                        ? "✅"
                                        : "-"}
                                    </td>
                                  ))}

                                  {/* Other fields */}
                                  <td>{data?.cfi?.noOfShares ?? "-"}</td>
                                  <td>{data?.cfi?.particulars ?? "-"}</td>
                                  <td>{data?.cfi?.paidUpValue ?? "-"}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </li>
                    </ol>
                    <div className="py-4 border-top border-3 border-black mt-5">
                      <p className="text-black fw-bold">
                        We certify that the particulars furnished hereinabove as
                        also in the attached documents are true and correct. We
                        further undertake to inform CDSL of any change in the
                        capital structure, company's particulars, additions etc.
                      </p>

                      <div className="row mt-4">
                        <div className="col-lg-6 my-2 fw-bold text-black">
                          <p className="mb-1">Place:</p>
                          <p className="form-control bg-light">
                            {data?.declaration?.place || "-"}
                          </p>
                        </div>
                        <div className="col-lg-6 my-2 fw-bold text-black">
                          <p className="mb-1">Name:</p>
                          <p className="form-control bg-light">
                            {data?.declaration?.name || "-"}
                          </p>
                        </div>
                        <div className="col-lg-6 my-2 fw-bold text-black">
                          <p className="mb-1">Date:</p>
                          <p className="form-control bg-light">
                            {data?.declaration?.date || "-"}
                          </p>
                        </div>
                        <div className="col-lg-6 my-2 fw-bold text-black">
                          <p className="mb-1">Designation:</p>
                          <p className="form-control bg-light">
                            {data?.declaration?.designation || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default View;
