import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserProfile } from "@shared/schema";
import { Loader2, Heart, Calendar, User, Save } from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";

// Form validation schema
const profileFormSchema = z.object({
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  chronic_conditions: z.string().optional(),
  medications: z.string().optional(),
  emergency_contact: z.string().optional(),
  medical_notes: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user profile
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery<UserProfile>({
    queryKey: ["/api/user/profile"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/profile");
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        // Profile doesn't exist yet, return an empty object
        return {} as UserProfile;
      }
      throw new Error("Failed to fetch profile");
    },
    enabled: !!user, // Only fetch if user is logged in
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (profile not found)
      if (error.status === 404) return false;
      return failureCount < 3;
    },
  });

  // Fetch medical history
  const {
    data: medicalHistory,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["/api/user/medical-history"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/medical-history");
      if (!response.ok) {
        throw new Error("Failed to fetch medical history");
      }
      return response.json();
    },
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fetch medical records
  const {
    data: medicalRecords,
    isLoading: isLoadingRecords,
    error: recordsError,
  } = useQuery({
    queryKey: ["/api/user/medical-records"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/medical-records");
      if (!response.ok) {
        throw new Error("Failed to fetch medical records");
      }
      return response.json();
    },
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fetch vital signs
  const {
    data: vitalSigns,
    isLoading: isLoadingVitalSigns,
    error: vitalSignsError,
  } = useQuery({
    queryKey: ["/api/user/vital-signs"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/vital-signs");
      if (!response.ok) {
        throw new Error("Failed to fetch vital signs");
      }
      return response.json();
    },
    enabled: !!user, // Only fetch if user is logged in
  });

  // Setup form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      date_of_birth: profile?.date_of_birth || "",
      gender: profile?.gender || "",
      height: profile?.height ? String(profile.height) : "",
      weight: profile?.weight ? String(profile.weight) : "",
      blood_type: profile?.blood_type || "",
      allergies: profile?.allergies || "",
      chronic_conditions: profile?.chronic_conditions || "",
      medications: profile?.medications || "",
      emergency_contact: profile?.emergency_contact || "",
      medical_notes: profile?.medical_notes || "",
    },
  });

  // Update form values when profile data is loaded
  React.useEffect(() => {
    if (profile) {
      form.reset({
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        height: profile.height ? String(profile.height) : "",
        weight: profile.weight ? String(profile.weight) : "",
        blood_type: profile.blood_type || "",
        allergies: profile.allergies || "",
        chronic_conditions: profile.chronic_conditions || "",
        medications: profile.medications || "",
        emergency_contact: profile.emergency_contact || "",
        medical_notes: profile.medical_notes || "",
      });
    }
  }, [profile, form]);

  // Save profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Convert string numbers to integers where needed
      const formattedData = {
        ...data,
        height: data.height ? parseInt(data.height) : null,
        weight: data.weight ? parseInt(data.weight) : null,
      };

      const response = await apiRequest("POST", "/api/user/profile", formattedData);
      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Saved",
        description: "Your medical profile has been updated successfully.",
      });
      // Invalidate the profile query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: ProfileFormValues) => {
    saveProfileMutation.mutate(data);
  };

  // Save item to medical history mutation
  const saveItemMutation = useMutation({
    mutationFn: async ({ itemType, itemId, saved }: { itemType: string; itemId: number; saved: boolean }) => {
      const response = await apiRequest("POST", "/api/user/save-item", {
        itemType,
        itemId,
        saved,
      });
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item Updated",
        description: "The item has been updated in your medical history.",
      });
      // Invalidate the medical history query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["/api/user/medical-history"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle saving/unsaving an item
  const handleSaveItem = (itemType: string, itemId: number, currentSaved: boolean) => {
    saveItemMutation.mutate({
      itemType,
      itemId,
      saved: !currentSaved,
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please login to view your profile</h1>
            <p className="mt-2 text-gray-600">You need to be logged in to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.username}'s Medical Profile</h1>
            <p className="text-gray-600">Manage your health information and medical history</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {isLoadingProfile ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Your basic health information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="blood_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blood Type</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Information</CardTitle>
                        <CardDescription>
                          Important information for healthcare providers
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="allergies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Allergies</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="List any allergies you have"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="chronic_conditions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chronic Conditions</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="List any chronic conditions"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="medications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Medications</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="List medications you're currently taking"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Emergency Information</CardTitle>
                        <CardDescription>
                          Contact information for emergencies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="emergency_contact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Name, relationship, phone number"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Notes</CardTitle>
                        <CardDescription>
                          Any other important medical information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="medical_notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medical Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any additional medical information"
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saveProfileMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {saveProfileMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Your documented medical history</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingRecords ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : medicalRecords?.length > 0 ? (
                    <div className="space-y-4">
                      {medicalRecords.map((record: any) => (
                        <div
                          key={record.id}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {record.title}
                            </h3>
                            <span className="bg-primary/10 text-primary text-xs font-medium rounded px-2 py-1">
                              {record.record_type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            <Calendar className="inline-block w-4 h-4 mr-1" />
                            {new Date(record.record_date).toLocaleDateString()}
                          </div>
                          {record.doctor_name && (
                            <div className="text-sm text-gray-500 mb-1">
                              <User className="inline-block w-4 h-4 mr-1" />
                              Dr. {record.doctor_name}
                            </div>
                          )}
                          {record.facility_name && (
                            <div className="text-sm text-gray-500 mb-2">
                              <Heart className="inline-block w-4 h-4 mr-1" />
                              {record.facility_name}
                            </div>
                          )}
                          {record.notes && (
                            <p className="text-sm text-gray-700 mt-2 border-t pt-2">
                              {record.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        No medical records found. Records will appear here when added.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs</CardTitle>
                  <CardDescription>
                    Your health measurements over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingVitalSigns ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : vitalSigns?.length > 0 ? (
                    <div className="space-y-4">
                      {vitalSigns.map((vitalSign: any) => (
                        <div
                          key={vitalSign.id}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="text-sm text-gray-500 mb-2">
                            <Calendar className="inline-block w-4 h-4 mr-1" />
                            {new Date(vitalSign.measurement_date).toLocaleDateString()}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {vitalSign.heart_rate && (
                              <div>
                                <span className="text-gray-500">Heart Rate:</span>{" "}
                                <span className="font-medium">{vitalSign.heart_rate} bpm</span>
                              </div>
                            )}
                            {(vitalSign.blood_pressure_systolic && vitalSign.blood_pressure_diastolic) && (
                              <div>
                                <span className="text-gray-500">Blood Pressure:</span>{" "}
                                <span className="font-medium">
                                  {vitalSign.blood_pressure_systolic}/{vitalSign.blood_pressure_diastolic} mmHg
                                </span>
                              </div>
                            )}
                            {vitalSign.temperature && (
                              <div>
                                <span className="text-gray-500">Temperature:</span>{" "}
                                <span className="font-medium">{vitalSign.temperature}°C</span>
                              </div>
                            )}
                            {vitalSign.respiratory_rate && (
                              <div>
                                <span className="text-gray-500">Respiratory Rate:</span>{" "}
                                <span className="font-medium">{vitalSign.respiratory_rate} bpm</span>
                              </div>
                            )}
                            {vitalSign.oxygen_saturation && (
                              <div>
                                <span className="text-gray-500">Oxygen Saturation:</span>{" "}
                                <span className="font-medium">{vitalSign.oxygen_saturation}%</span>
                              </div>
                            )}
                          </div>
                          {vitalSign.notes && (
                            <p className="text-sm text-gray-700 mt-2 border-t pt-2">
                              {vitalSign.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        No vital signs recorded. Measurements will appear here when added.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history" className="space-y-6">
            {isLoadingHistory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Medical Queries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Queries</CardTitle>
                    <CardDescription>
                      Your saved medical questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalHistory?.medicalQueries?.length > 0 ? (
                      <div className="space-y-4">
                        {medicalHistory.medicalQueries.map((query: any) => (
                          <div
                            key={query.id}
                            className="p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex justify-between">
                              <div className="text-sm text-gray-500 mb-2">
                                {new Date(query.timestamp).toLocaleDateString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveItem("medical-query", query.id, query.saved)}
                                className="h-7 w-7 p-0"
                                title={query.saved ? "Remove from history" : "Save to history"}
                              >
                                <Save className={`h-4 w-4 ${query.saved ? "fill-primary" : ""}`} />
                              </Button>
                            </div>
                            <p className="font-medium mb-2">{query.question}</p>
                            <p className="text-sm text-gray-700">{query.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">
                          No saved medical queries. Questions you save will appear here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Symptom Checks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Symptom Analyses</CardTitle>
                    <CardDescription>
                      Your saved symptom checks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalHistory?.symptomChecks?.length > 0 ? (
                      <div className="space-y-4">
                        {medicalHistory.symptomChecks.map((check: any) => (
                          <div
                            key={check.id}
                            className="p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex justify-between">
                              <div className="text-sm text-gray-500 mb-2">
                                {new Date(check.timestamp).toLocaleDateString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveItem("symptom-check", check.id, check.saved)}
                                className="h-7 w-7 p-0"
                                title={check.saved ? "Remove from history" : "Save to history"}
                              >
                                <Save className={`h-4 w-4 ${check.saved ? "fill-primary" : ""}`} />
                              </Button>
                            </div>
                            <p className="font-medium mb-2">Symptoms: {check.usersymptom}</p>
                            {check.agegroup && (
                              <p className="text-sm text-gray-700 mb-1">Age: {check.agegroup}</p>
                            )}
                            {check.result && (
                              <div className="mt-2 border-t pt-2">
                                <p className="text-sm font-medium">Results:</p>
                                <div className="mt-1 space-y-1">
                                  {check.result.conditions?.map((condition: any, i: number) => (
                                    <div key={i} className="text-sm">
                                      <span className="font-medium">{condition.name}</span>
                                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                        condition.probability === "high" 
                                          ? "bg-red-100 text-red-800" 
                                          : condition.probability === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}>
                                        {condition.probability} probability
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">
                          No saved symptom checks. Analyses you save will appear here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Medicine Scans */}
                <Card>
                  <CardHeader>
                    <CardTitle>Medicine Information</CardTitle>
                    <CardDescription>
                      Your saved medicine scans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalHistory?.medicineScans?.length > 0 ? (
                      <div className="space-y-4">
                        {medicalHistory.medicineScans.map((scan: any) => (
                          <div
                            key={scan.id}
                            className="p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex justify-between">
                              <div className="text-sm text-gray-500 mb-2">
                                {new Date(scan.timestamp).toLocaleDateString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveItem("medicine-scan", scan.id, scan.saved)}
                                className="h-7 w-7 p-0"
                                title={scan.saved ? "Remove from history" : "Save to history"}
                              >
                                <Save className={`h-4 w-4 ${scan.saved ? "fill-primary" : ""}`} />
                              </Button>
                            </div>
                            {scan.analysis_result && (
                              <>
                                <h4 className="font-medium">{scan.analysis_result.name}</h4>
                                <p className="text-sm text-gray-700 mt-1">
                                  {scan.analysis_result.primaryUse}
                                </p>
                                {scan.analysis_result.dosage && (
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-500">DOSAGE</span>
                                    <p className="text-sm">{scan.analysis_result.dosage}</p>
                                  </div>
                                )}
                                {scan.analysis_result.warnings && (
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-500">WARNINGS</span>
                                    <p className="text-sm text-red-600">{scan.analysis_result.warnings}</p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">
                          No saved medicine scans. Medication information you save will appear here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}