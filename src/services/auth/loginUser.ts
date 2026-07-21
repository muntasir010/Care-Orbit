/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export const LoginUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        error: data?.message || "Login failed" 
      };
    }

    return {
      success: true,
      data: data
    };

  } catch (error: any) {
    console.log("Server action login error:", error);
    return { 
      success: false, 
      error: error?.message || "Internal Server Error" 
    };
  }
};