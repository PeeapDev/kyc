"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

declare global {
  interface Window {
    google: typeof google;
  }
}

type SettingSection = "general" | "security" | "notifications" | "privacy" | "createForm" | "twilio" | "smtp" | "theme" | "locations"

interface SettingsPageProps {
  onSettingsChange: (logo: string, title: string, timeFormat: string, googleMapsApiKey: string) => void;
  defaultLogo: string;
  currentLogo: string;
  currentTitle: string;
  currentTimeFormat: string;
  currentGoogleMapsApiKey: string;
}

// Add this type for country data
type Country = {
  name: string;
  latitude: number;
  longitude: number;
}

// Updated list of countries with their coordinates
const allCountries: Country[] = [
  { name: "Afghanistan", latitude: 33.93911, longitude: 67.709953 },
  { name: "Albania", latitude: 41.153332, longitude: 20.168331 },
  { name: "Algeria", latitude: 28.033886, longitude: 1.659626 },
  { name: "Andorra", latitude: 42.546245, longitude: 1.601554 },
  { name: "Angola", latitude: -11.202692, longitude: 17.873887 },
  { name: "Antigua and Barbuda", latitude: 17.060816, longitude: -61.796428 },
  { name: "Argentina", latitude: -38.416097, longitude: -63.616672 },
  { name: "Armenia", latitude: 40.069099, longitude: 45.038189 },
  { name: "Australia", latitude: -25.274398, longitude: 133.775136 },
  { name: "Austria", latitude: 47.516231, longitude: 14.550072 },
  { name: "Azerbaijan", latitude: 40.143105, longitude: 47.576927 },
  { name: "Bahamas", latitude: 25.03428, longitude: -77.39628 },
  { name: "Bahrain", latitude: 26.0667, longitude: 50.5577 },
  { name: "Bangladesh", latitude: 23.684994, longitude: 90.356331 },
  { name: "Barbados", latitude: 13.193887, longitude: -59.543198 },
  { name: "Belarus", latitude: 53.709807, longitude: 27.953389 },
  { name: "Belgium", latitude: 50.503887, longitude: 4.469936 },
  { name: "Belize", latitude: 17.189877, longitude: -88.49765 },
  { name: "Benin", latitude: 9.30769, longitude: 2.315834 },
  { name: "Bhutan", latitude: 27.514162, longitude: 90.433601 },
  { name: "Bolivia", latitude: -16.290154, longitude: -63.588653 },
  { name: "Bosnia and Herzegovina", latitude: 43.915886, longitude: 17.679076 },
  { name: "Botswana", latitude: -22.328474, longitude: 24.684866 },
  { name: "Brazil", latitude: -14.235004, longitude: -51.92528 },
  { name: "Brunei", latitude: 4.535277, longitude: 114.727669 },
  { name: "Bulgaria", latitude: 42.733883, longitude: 25.48583 },
  { name: "Burkina Faso", latitude: 12.238333, longitude: -1.561593 },
  { name: "Burundi", latitude: -3.373056, longitude: 29.918886 },
  { name: "Cabo Verde", latitude: 16.002082, longitude: -24.013197 },
  { name: "Cambodia", latitude: 12.565679, longitude: 104.990963 },
  { name: "Cameroon", latitude: 7.369722, longitude: 12.354722 },
  { name: "Canada", latitude: 56.130366, longitude: -106.346771 },
  { name: "Central African Republic", latitude: 6.611111, longitude: 20.939444 },
  { name: "Chad", latitude: 15.454166, longitude: 18.732207 },
  { name: "Chile", latitude: -35.675147, longitude: -71.542969 },
  { name: "China", latitude: 35.86166, longitude: 104.195397 },
  { name: "Colombia", latitude: 4.570868, longitude: -74.297333 },
  { name: "Comoros", latitude: -11.875001, longitude: 43.872219 },
  { name: "Congo (Congo-Brazzaville)", latitude: -0.228021, longitude: 15.827659 },
  { name: "Congo (Democratic Republic of the)", latitude: -4.038333, longitude: 21.758664 },
  { name: "Costa Rica", latitude: 9.748917, longitude: -83.753428 },
  { name: "Croatia", latitude: 45.1, longitude: 15.2 },
  { name: "Cuba", latitude: 21.521757, longitude: -77.781167 },
  { name: "Cyprus", latitude: 35.126413, longitude: 33.429859 },
  { name: "Czech Republic", latitude: 49.817492, longitude: 15.472962 },
  { name: "Denmark", latitude: 56.26392, longitude: 9.501785 },
  { name: "Djibouti", latitude: 11.825138, longitude: 42.590275 },
  { name: "Dominica", latitude: 15.414999, longitude: -61.370976 },
  { name: "Dominican Republic", latitude: 18.735693, longitude: -70.162651 },
  { name: "East Timor (Timor-Leste)", latitude: -8.874217, longitude: 125.727539 },
  { name: "Ecuador", latitude: -1.831239, longitude: -78.183406 },
  { name: "Egypt", latitude: 26.820553, longitude: 30.802498 },
  { name: "El Salvador", latitude: 13.794185, longitude: -88.89653 },
  { name: "Equatorial Guinea", latitude: 1.650801, longitude: 10.267895 },
  { name: "Eritrea", latitude: 15.179384, longitude: 39.782334 },
  { name: "Estonia", latitude: 58.595272, longitude: 25.013607 },
  { name: "Eswatini (Swaziland)", latitude: -26.522503, longitude: 31.465866 },
  { name: "Ethiopia", latitude: 9.145, longitude: 40.489673 },
  { name: "Fiji", latitude: -17.713371, longitude: 178.065032 },
  { name: "Finland", latitude: 61.92411, longitude: 25.748151 },
  { name: "France", latitude: 46.227638, longitude: 2.213749 },
  { name: "Gabon", latitude: -0.803689, longitude: 11.609444 },
  { name: "Gambia", latitude: 13.443182, longitude: -15.310139 },
  { name: "Georgia", latitude: 42.315407, longitude: 43.356892 },
  { name: "Germany", latitude: 51.165691, longitude: 10.451526 },
  { name: "Ghana", latitude: 7.946527, longitude: -1.023194 },
  { name: "Greece", latitude: 39.074208, longitude: 21.824312 },
  { name: "Grenada", latitude: 12.262776, longitude: -61.604171 },
  { name: "Guatemala", latitude: 15.783471, longitude: -90.230759 },
  { name: "Guinea", latitude: 9.945587, longitude: -9.696645 },
  { name: "Guinea-Bissau", latitude: 11.803749, longitude: -15.180413 },
  { name: "Guyana", latitude: 4.860416, longitude: -58.93018 },
  { name: "Haiti", latitude: 18.971187, longitude: -72.285215 },
  { name: "Honduras", latitude: 15.199999, longitude: -86.241905 },
  { name: "Hungary", latitude: 47.162494, longitude: 19.503304 },
  { name: "Iceland", latitude: 64.963051, longitude: -19.020835 },
  { name: "India", latitude: 20.593684, longitude: 78.96288 },
  { name: "Indonesia", latitude: -0.789275, longitude: 113.921327 },
  { name: "Iran", latitude: 32.427908, longitude: 53.688046 },
  { name: "Iraq", latitude: 33.223191, longitude: 43.679291 },
  { name: "Ireland", latitude: 53.41291, longitude: -8.24389 },
  { name: "Israel", latitude: 31.046051, longitude: 34.851612 },
  { name: "Italy", latitude: 41.87194, longitude: 12.56738 },
  { name: "Ivory Coast", latitude: 7.539989, longitude: -5.54708 },
  { name: "Jamaica", latitude: 18.109581, longitude: -77.297508 },
  { name: "Japan", latitude: 36.204824, longitude: 138.252924 },
  { name: "Jordan", latitude: 30.585164, longitude: 36.238414 },
  { name: "Kazakhstan", latitude: 48.019573, longitude: 66.923684 },
  { name: "Kenya", latitude: -0.023559, longitude: 37.906193 },
  { name: "Kiribati", latitude: -3.370417, longitude: -168.734039 },
  { name: "Korea (North)", latitude: 40.339852, longitude: 127.510093 },
  { name: "Korea (South)", latitude: 35.907757, longitude: 127.766922 },
  { name: "Kuwait", latitude: 29.31166, longitude: 47.481766 },
  { name: "Kyrgyzstan", latitude: 41.20438, longitude: 74.766098 },
  { name: "Laos", latitude: 19.85627, longitude: 102.495496 },
  { name: "Latvia", latitude: 56.879635, longitude: 24.603189 },
  { name: "Lebanon", latitude: 33.854721, longitude: 35.862285 },
  { name: "Lesotho", latitude: -29.609988, longitude: 28.233608 },
  { name: "Liberia", latitude: 6.428055, longitude: -9.429499 },
  { name: "Libya", latitude: 26.3351, longitude: 17.228331 },
  { name: "Liechtenstein", latitude: 47.166, longitude: 9.555373 },
  { name: "Lithuania", latitude: 55.169438, longitude: 23.881275 },
  { name: "Luxembourg", latitude: 49.815273, longitude: 6.129583 },
  { name: "Madagascar", latitude: -18.766947, longitude: 46.869107 },
  { name: "Malawi", latitude: -13.254308, longitude: 34.301525 },
  { name: "Malaysia", latitude: 4.210484, longitude: 101.975766 },
  { name: "Maldives", latitude: 3.202778, longitude: 73.22068 },
  { name: "Mali", latitude: 17.570692, longitude: -3.996166 },
  { name: "Malta", latitude: 35.937496, longitude: 14.375416 },
  { name: "Marshall Islands", latitude: 7.131474, longitude: 171.184478 },
  { name: "Mauritania", latitude: 21.00789, longitude: -10.940835 },
  { name: "Mauritius", latitude: -20.348404, longitude: 57.552152 },
  { name: "Mexico", latitude: 23.634501, longitude: -102.552784 },
  { name: "Micronesia", latitude: 7.425554, longitude: 150.550812 },
  { name: "Moldova", latitude: 47.411631, longitude: 28.369885 },
  { name: "Monaco", latitude: 43.750298, longitude: 7.412841 },
  { name: "Mongolia", latitude: 46.862496, longitude: 103.846656 },
  { name: "Montenegro", latitude: 42.708678, longitude: 19.37439 },
  { name: "Morocco", latitude: 31.791702, longitude: -7.09262 },
  { name: "Mozambique", latitude: -18.665695, longitude: 35.529562 },
  { name: "Myanmar (Burma)", latitude: 21.913965, longitude: 95.956223 },
  { name: "Namibia", latitude: -22.95764, longitude: 18.49041 },
  { name: "Nauru", latitude: -0.522778, longitude: 166.931503 },
  { name: "Nepal", latitude: 28.394857, longitude: 84.124008 },
  { name: "Netherlands", latitude: 52.132633, longitude: 5.291266 },
  { name: "New Zealand", latitude: -40.900557, longitude: 174.885971 },
  { name: "Nicaragua", latitude: 12.865416, longitude: -85.207229 },
  { name: "Niger", latitude: 17.607789, longitude: 8.081666 },
  { name: "Nigeria", latitude: 9.081999, longitude: 8.675277 },
  { name: "North Macedonia", latitude: 41.608635, longitude: 21.745275 },
  { name: "Norway", latitude: 60.472024, longitude: 8.468946 },
  { name: "Oman", latitude: 21.512583, longitude: 55.923255 },
  { name: "Pakistan", latitude: 30.375321, longitude: 69.345116 },
  { name: "Palau", latitude: 7.51498, longitude: 134.58252 },
  { name: "Panama", latitude: 8.537981, longitude: -80.782127 },
  { name: "Papua New Guinea", latitude: -6.314993, longitude: 143.95555 },
  { name: "Paraguay", latitude: -23.442503, longitude: -58.443832 },
  { name: "Peru", latitude: -9.189967, longitude: -75.015152 },
  { name: "Philippines", latitude: 12.879721, longitude: 121.774017 },
  { name: "Poland", latitude: 51.919438, longitude: 19.145136 },
  { name: "Portugal", latitude: 39.399872, longitude: -8.224454 },
  { name: "Qatar", latitude: 25.354826, longitude: 51.183884 },
  { name: "Romania", latitude: 45.943161, longitude: 24.96676 },
  { name: "Russia", latitude: 61.52401, longitude: 105.318756 },
  { name: "Rwanda", latitude: -1.940278, longitude: 29.873888 },
  { name: "Saint Kitts and Nevis", latitude: 17.357822, longitude: -62.782998 },
  { name: "Saint Lucia", latitude: 13.909444, longitude: -60.978893 },
  { name: "Saint Vincent and the Grenadines", latitude: 12.984305, longitude: -61.287228 },
  { name: "Samoa", latitude: -13.759029, longitude: -172.104629 },
  { name: "San Marino", latitude: 43.94236, longitude: 12.457777 },
  { name: "Sao Tome and Principe", latitude: 0.18636, longitude: 6.613081 },
  { name: "Saudi Arabia", latitude: 23.885942, longitude: 45.079162 },
  { name: "Senegal", latitude: 14.497401, longitude: -14.452362 },
  { name: "Serbia", latitude: 44.016521, longitude: 21.005859 },
  { name: "Seychelles", latitude: -4.679574, longitude: 55.491977 },
  { name: "Sierra Leone", latitude: 8.460555, longitude: -11.779889 },
  { name: "Singapore", latitude: 1.352083, longitude: 103.819836 },
  { name: "Slovakia", latitude: 48.669026, longitude: 19.699024 },
  { name: "Slovenia", latitude: 46.151241, longitude: 14.995463 },
  { name: "Solomon Islands", latitude: -9.64571, longitude: 160.156194 },
  { name: "Somalia", latitude: 5.152149, longitude: 46.199616 },
  { name: "South Africa", latitude: -30.559482, longitude: 22.937506 },
  { name: "South Sudan", latitude: 6.876991, longitude: 31.306978 },
  { name: "Spain", latitude: 40.463667, longitude: -3.74922 },
  { name: "Sri Lanka", latitude: 7.873054, longitude: 80.771797 },
  { name: "Sudan", latitude: 12.862807, longitude: 30.217636 },
  { name: "Suriname", latitude: 3.919305, longitude: -56.027783 },
  { name: "Sweden", latitude: 60.128161, longitude: 18.643501 },
  { name: "Switzerland", latitude: 46.818188, longitude: 8.227512 },
  { name: "Syria", latitude: 34.802075, longitude: 38.996815 },
  { name: "Taiwan", latitude: 23.69781, longitude: 120.960515 },
  { name: "Tajikistan", latitude: 38.861034, longitude: 71.276093 },
  { name: "Tanzania", latitude: -6.369028, longitude: 34.888822 },
  { name: "Thailand", latitude: 15.870032, longitude: 100.992541 },
  { name: "Togo", latitude: 8.619543, longitude: 0.824782 },
  { name: "Tonga", latitude: -21.178986, longitude: -175.198242 },
  { name: "Trinidad and Tobago", latitude: 10.691803, longitude: -61.222503 },
  { name: "Tunisia", latitude: 33.886917, longitude: 9.537499 },
  { name: "Turkey", latitude: 38.963745, longitude: 35.243322 },
  { name: "Turkmenistan", latitude: 38.969719, longitude: 59.556278 },
  { name: "Tuvalu", latitude: -7.109535, longitude: 177.64933 },
  { name: "Uganda", latitude: 1.373333, longitude: 32.290275 },
  { name: "Ukraine", latitude: 48.379433, longitude: 31.16558 },
  { name: "United Arab Emirates", latitude: 23.424076, longitude: 53.847818 },
  { name: "United Kingdom", latitude: 55.378051, longitude: -3.435973 },
  { name: "United States", latitude: 37.09024, longitude: -95.712891 },
  { name: "Uruguay", latitude: -32.522779, longitude: -55.765835 },
  { name: "Uzbekistan", latitude: 41.377491, longitude: 64.585262 },
  { name: "Vanuatu", latitude: -15.376706, longitude: 166.959158 },
  { name: "Vatican City", latitude: 41.902916, longitude: 12.453389 },
  { name: "Venezuela", latitude: 6.42375, longitude: -66.58973 },
  { name: "Vietnam", latitude: 14.058324, longitude: 108.277199 },
  { name: "Yemen", latitude: 15.552727, longitude: 48.516388 },
  { name: "Zambia", latitude: -13.133897, longitude: 27.849332 },
  { name: "Zimbabwe", latitude: -19.015438, longitude: 29.154857 }
];

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

const initialFormFields: FormField[] = [
  { id: 'firstName', type: 'text', label: 'First Name', required: true },
  { id: 'lastName', type: 'text', label: 'Last Name', required: true },
  { id: 'email', type: 'email', label: 'Email', required: true },
  { id: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
  { id: 'address', type: 'address', label: 'Address', required: true },
  { id: 'documentType', type: 'select', label: 'Document Type', required: true, options: ['Passport', 'Driver\'s License', 'National ID'] },
  { id: 'documentNumber', type: 'text', label: 'Document Number', required: true },
];

interface Region {
  id: string;
  name: string;
  count: number;
}

export function SettingsPage({
  onSettingsChange,
  defaultLogo,
  currentLogo,
  currentTitle,
  currentTimeFormat,
  currentGoogleMapsApiKey
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("general")
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState(currentLogo)
  const [generalSettings, setGeneralSettings] = useState({
    footerText: "All rights reserved",
    googleAnalytics: "",
    timezone: "UTC",
    dashboardTitle: currentTitle,
    dateFormat: "MM/DD/YYYY",
    timeFormat: currentTimeFormat,
    emailConfirmation: "yes",
    googleMapsApiKey: currentGoogleMapsApiKey,
    country: "",
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>(initialFormFields);

  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: ""
  })

  const [smtpSettings, setSmtpSettings] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: ""
  })

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    fontFamily: "Arial",
  })

  const [regions, setRegions] = useState<Region[]>([
    { id: '1', name: 'North America', count: 0 },
    { id: '2', name: 'Europe', count: 0 },
    { id: '3', name: 'Asia', count: 0 },
    { id: '4', name: 'Africa', count: 0 },
    { id: '5', name: 'South America', count: 0 },
  ]);
  const [newRegionName, setNewRegionName] = useState('');

  const handleGeneralSettingChange = (key: string, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    onSettingsChange(
      logoPreview, 
      generalSettings.dashboardTitle, 
      generalSettings.timeFormat,
      generalSettings.googleMapsApiKey
    )
  }, [logoPreview, generalSettings.dashboardTitle, generalSettings.timeFormat, generalSettings.googleMapsApiKey, onSettingsChange])

  useEffect(() => {
    if (window.google && window.google.maps && mapRef.current && !map) {
      initializeMap();
    }
  }, [generalSettings.googleMapsApiKey]);

  const initializeMap = () => {
    try {
      const newMap = new window.google.maps.Map(mapRef.current!, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });
      setMap(newMap);
      setIsMapLoaded(true);
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setMapError("Failed to initialize Google Maps. Please check your API key and try again.");
    }
  };

  const loadGoogleMaps = () => {
    setMapError(null);
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${generalSettings.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      console.error("Error loading Google Maps script");
      setMapError("Failed to load Google Maps. Please check your API key and internet connection.");
    };
    document.head.appendChild(script);
  };

  const updateMapForCountry = (country: Country) => {
    if (map && isMapLoaded) {
      map.setCenter({ lat: country.latitude, lng: country.longitude });
      map.setZoom(6);
      new google.maps.Marker({
        position: { lat: country.latitude, lng: country.longitude },
        map: map,
        title: country.name
      });
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleGeneralSettingChange('country', value);

    const selectedCountry = allCountries.find(country => country.name.toLowerCase() === value.toLowerCase());
    if (selectedCountry) {
      updateMapForCountry(selectedCountry);
    }
  };

  const filteredCountries = useMemo(() => {
    return allCountries.filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setLogo(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setLogoPreview(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetLogo = () => {
    setLogo(null)
    setLogoPreview(defaultLogo)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormFields(items);
  };

  const handleTwilioSettingChange = (key: string, value: string) => {
    setTwilioSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSmtpSettingChange = (key: string, value: string) => {
    setSmtpSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleThemeSettingChange = (key: string, value: string) => {
    setThemeSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAddRegion = () => {
    if (newRegionName.trim() !== '') {
      const newRegion: Region = {
        id: (regions.length + 1).toString(),
        name: newRegionName.trim(),
        count: 0,
      };
      setRegions([...regions, newRegion]);
      setNewRegionName('');
    }
  };

  const renderSettingContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Logo Settings</h3>
              <div className="mb-4">
                <Label htmlFor="logo-upload">Upload Logo</Label>
                <Input id="logo-upload" type="file" onChange={handleLogoChange} accept="image/*" />
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Current Logo:</h4>
                <Image src={logoPreview} alt="Logo Preview" width={150} height={50} />
              </div>
              <Button onClick={handleResetLogo} variant="outline" className="mt-2">
                Reset to Default Logo
              </Button>
            </div>
            <div>
              <Label htmlFor="footer-text">Footer Text</Label>
              <Input
                id="footer-text"
                value={generalSettings.footerText}
                onChange={(e) => handleGeneralSettingChange('footerText', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="google-analytics">Google Analytics Code</Label>
              <Input
                id="google-analytics"
                value={generalSettings.googleAnalytics}
                onChange={(e) => handleGeneralSettingChange('googleAnalytics', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={generalSettings.timezone}
                onValueChange={(value) => handleGeneralSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  {/* Add more timezones as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dashboard-title">Dashboard Title</Label>
              <Input
                id="dashboard-title"
                value={generalSettings.dashboardTitle}
                onChange={(e) => handleGeneralSettingChange('dashboardTitle', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date-format">Date Format</Label>
              <Input
                id="date-format"
                value={generalSettings.dateFormat}
                onChange={(e) => handleGeneralSettingChange('dateFormat', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time-format">Time Format</Label>
              <Select
                value={generalSettings.timeFormat}
                onValueChange={(value) => handleGeneralSettingChange('timeFormat', value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="12">12 Hour (04:40 PM)</SelectItem>
                  <SelectItem value="24">24 Hour (16:40)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email-confirmation">Required Email Confirmation for New Users</Label>
              <Select
                value={generalSettings.emailConfirmation}
                onValueChange={(value) => handleGeneralSettingChange('emailConfirmation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                ref={inputRef}
                id="country"
                placeholder="Search for a country"
                className="bg-white"
                value={searchTerm}
                onChange={handleCountryChange}
              />
              {searchTerm && (
                <div className="mt-2 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.name}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(country.name)
                        handleGeneralSettingChange('country', country.name)
                        if (map) {
                          map.setCenter({ lat: country.latitude, lng: country.longitude })
                          map.setZoom(6)
                          new google.maps.Marker({
                            position: { lat: country.latitude, lng: country.longitude },
                            map: map,
                            title: country.name
                          })
                        }
                      }}
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="google-maps-api-key">Google Maps API Key</Label>
              <Input
                id="google-maps-api-key"
                value={generalSettings.googleMapsApiKey}
                onChange={(e) => handleGeneralSettingChange('googleMapsApiKey', e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                This key will be used for Google Places API.{' '}
                <a 
                  href="https://console.cloud.google.com/google/maps-apis/overview" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Get your API key here
                </a>.
              </p>
              <Button onClick={loadGoogleMaps} className="mt-2">
                Load Google Maps
              </Button>
              {mapError && (
                <p className="text-red-500 mt-2">{mapError}</p>
              )}
            </div>
            <div>
              <Label>Selected Country Map Preview</Label>
              <div ref={mapRef} style={{ width: '100%', height: '400px' }}>
                {mapError && (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    {mapError}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case "createForm":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Create KYC Application Form</h3>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="formFields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {formFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-2 rounded shadow"
                          >
                            <div className="flex justify-between items-center">
                              <span>{field.label}</span>
                              <div>
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={() => {
                                    const newFields = formFields.map(f =>
                                      f.id === field.id ? { ...f, required: !f.required } : f
                                    );
                                    setFormFields(newFields);
                                  }}
                                  className="mr-2"
                                />
                                <label className="mr-4">Required</label>
                                <button
                                  onClick={() => setFormFields(formFields.filter(f => f.id !== field.id))}
                                  className="text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button onClick={() => console.log(formFields)}>Save Form Configuration</Button>

            {/* Dynamic Settings Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Dynamic Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-region">Add New Region</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="new-region"
                      value={newRegionName}
                      onChange={(e) => setNewRegionName(e.target.value)}
                      placeholder="Enter new region name"
                    />
                    <Button onClick={handleAddRegion}>Add Region</Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-2">Current Regions</h4>
                  <ul className="list-disc pl-5">
                    {regions.map((region) => (
                      <li key={region.id}>{region.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      case "security":
        return <div>Security Settings Content</div>
      case "notifications":
        return <div>Notification Settings Content</div>
      case "privacy":
        return <div>Privacy Settings Content</div>
      case "twilio":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Twilio SMS Settings</h3>
            <div>
              <Label htmlFor="twilio-account-sid">Account SID</Label>
              <Input
                id="twilio-account-sid"
                value={twilioSettings.accountSid}
                onChange={(e) => handleTwilioSettingChange('accountSid', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="twilio-auth-token">Auth Token</Label>
              <Input
                id="twilio-auth-token"
                type="password"
                value={twilioSettings.authToken}
                onChange={(e) => handleTwilioSettingChange('authToken', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="twilio-phone-number">Twilio Phone Number</Label>
              <Input
                id="twilio-phone-number"
                value={twilioSettings.phoneNumber}
                onChange={(e) => handleTwilioSettingChange('phoneNumber', e.target.value)}
              />
            </div>
            <Button onClick={() => console.log("Save Twilio settings", twilioSettings)}>
              Save Twilio Settings
            </Button>
          </div>
        )
      case "smtp":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">SMTP Settings</h3>
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={smtpSettings.host}
                onChange={(e) => handleSmtpSettingChange('host', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                value={smtpSettings.port}
                onChange={(e) => handleSmtpSettingChange('port', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input
                id="smtp-username"
                value={smtpSettings.username}
                onChange={(e) => handleSmtpSettingChange('username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                value={smtpSettings.password}
                onChange={(e) => handleSmtpSettingChange('password', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-from-email">From Email</Label>
              <Input
                id="smtp-from-email"
                type="email"
                value={smtpSettings.fromEmail}
                onChange={(e) => handleSmtpSettingChange('fromEmail', e.target.value)}
              />
            </div>
            <Button onClick={() => console.log("Save SMTP settings", smtpSettings)}>
              Save SMTP Settings
            </Button>
          </div>
        )
      case "theme":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input
                id="primary-color"
                type="color"
                value={themeSettings.primaryColor}
                onChange={(e) => handleThemeSettingChange('primaryColor', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <Input
                id="secondary-color"
                type="color"
                value={themeSettings.secondaryColor}
                onChange={(e) => handleThemeSettingChange('secondaryColor', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={themeSettings.fontFamily}
                onValueChange={(value) => handleThemeSettingChange('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => console.log("Save Theme settings", themeSettings)}>
              Save Theme Settings
            </Button>
          </div>
        )
      case "locations":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Manage Locations</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-region">Add New Region</Label>
                <div className="flex space-x-2">
                  <Input
                    id="new-region"
                    value={newRegionName}
                    onChange={(e) => setNewRegionName(e.target.value)}
                    placeholder="Enter new region name"
                  />
                  <Button onClick={handleAddRegion}>Add Region</Button>
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Current Regions</h4>
                <ul className="list-disc pl-5">
                  {regions.map((region) => (
                    <li key={region.id}>{region.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      default:
        return <div>Select a setting from the sidebar</div>
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <div className="space-y-2">
          <Button
            variant={activeSection === "general" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("general")}
          >
            General
          </Button>
          <Button
            variant={activeSection === "theme" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("theme")}
          >
            Theme
          </Button>
          <Button
            variant={activeSection === "security" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("security")}
          >
            Security
          </Button>
          <Button
            variant={activeSection === "notifications" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </Button>
          <Button
            variant={activeSection === "privacy" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("privacy")}
          >
            Privacy
          </Button>
          <Button
            variant={activeSection === "createForm" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("createForm")}
          >
            Create Form
          </Button>
          <Button
            variant={activeSection === "twilio" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("twilio")}
          >
            Twilio SMS
          </Button>
          <Button
            variant={activeSection === "smtp" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("smtp")}
          >
            SMTP
          </Button>
          <Button
            variant={activeSection === "locations" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("locations")}
          >
            Locations
          </Button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {renderSettingContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}