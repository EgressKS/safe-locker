// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
// import { LogOut, User, Moon, CreditCard, X, HelpCircle, UserX } from 'lucide-react-native';
// import { useRouter } from 'expo-router';

// export default function ProfilePanel() {
//   const router = useRouter();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const name = 'John Doe';
//   const email = 'john.doe@example.com';

//   return (
//     <View style={styles.container}>
//       {/* Sticky Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Account</Text>
//         <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
//           <X size={24} color="#4B5563" />
//         </TouchableOpacity>
//       </View>

//       {/* Main Content */}
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <Image
//             source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
//             style={styles.profileImage}
//           />
//           <Text style={styles.profileName}>{name}</Text>
//           <Text style={styles.profileEmail}>{email}</Text>
//         </View>

//         {/* Menu Section */}
//         <View style={styles.menuSection}>
//           <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate('/screens/AccountSettings')}>
//             <User size={20} color="#4F46E5" />
//             <Text style={styles.menuText}>Account Settings</Text>
//           </TouchableOpacity>

//           <View style={styles.menuItem}>
//             <Moon size={20} color="#4F46E5" />
//             <Text style={styles.menuText}>Dark Mode</Text>
//             <Switch
//               style={{ marginLeft: 'auto' }}
//               value={isDarkMode}
//               onValueChange={setIsDarkMode}
//               trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
//               thumbColor={isDarkMode ? '#4F46E5' : '#9CA3AF'}
//             />
//           </View>

//           <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/screens/SendEarnMoney')}>
//             <CreditCard size={20} color="#4F46E5" />
//             <Text style={styles.menuText}>Send/Earn Money</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/screens/HelpFeedback')}>
//             <HelpCircle size={20} color="#4F46E5" />
//             <Text style={styles.menuText}>Help & Feedback</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Danger Zone Section */}
//         <View style={styles.dangerZoneSection}>
//           <Text style={styles.dangerZoneHeader}>Danger Zone</Text>
//           <TouchableOpacity style={styles.dangerButton} onPress={() => router.push('/screens/CloseAccount')}>
//             <UserX size={20} color="#EF4444" />
//             <Text style={styles.dangerButtonText}>Close Account</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.dangerButton} onPress={() => router.push('Logout')}>
//             <LogOut size={20} color="#EF4444" />
//             <Text style={styles.dangerButtonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Footer (non-sticky) */}
//         <View style={styles.footer}>
//           <View style={styles.footerLinks}>
//             <TouchableOpacity onPress={() => router.push('PrivacyPolicy')}>
//               <Text style={styles.footerLinkText}>Privacy Policy</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push('TermsOfService')}>
//               <Text style={styles.footerLinkText}>Terms of Service</Text>
//             </TouchableOpacity>
//             <Text style={styles.footerLinkText}>© 2025 Safe-Locker</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollContainer: {
//     paddingTop: 45, 
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F9FAFB',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     zIndex: 1,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingVertical: 26,
//     backgroundColor: '#F9FAFB',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   profileImage: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     marginBottom: 12,
//   },
//   profileName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   profileEmail: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   menuSection: {
//     backgroundColor: '#FFFFFF',
//     marginTop: 16,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 60,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   menuText: {
//     fontSize: 16,
//     color: '#1F2937',
//     marginLeft: 16,
//   },
//   dangerZoneSection: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: '#FFF5F5',
//     borderTopWidth: 1,
//     borderTopColor: '#EF4444',
//   },
//   dangerZoneHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#EF4444',
//     marginBottom: 12,
//   },
//   dangerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   dangerButtonText: {
//     fontSize: 16,
//     color: '#EF4444',
//     marginLeft: 12,
//   },
//   footer: {
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     backgroundColor: '#F9FAFB',
//     paddingVertical: 2,
//     paddingBottom:3
//   },
//   footerLinks: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 8,
//   },
//   footerLinkText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
// });

// export default ProfilePanel;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { LogOut, User, Moon, CreditCard, X, HelpCircle, UserX } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfilePanel() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const name = 'John Doe';
  const email = 'john.doe@example.com';

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section with Background Image */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: backgroundImageUrl }}
            style={styles.backgroundImage}  // Set the background image
          />
          <View style={styles.profileInfoContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate('/screens/AccountSettings')}>
            <User size={20} color="#4F46E5" />
            <Text style={styles.menuText}>Account Settings</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Moon size={20} color="#4F46E5" />
            <Text style={styles.menuText}>Dark Mode</Text>
            <Switch
              style={{ marginLeft: 'auto' }}
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
              thumbColor={isDarkMode ? '#4F46E5' : '#9CA3AF'}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/screens/SendEarnMoney')}>
            <CreditCard size={20} color="#4F46E5" />
            <Text style={styles.menuText}>Send/Earn Money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/screens/HelpFeedback')}>
            <HelpCircle size={20} color="#4F46E5" />
            <Text style={styles.menuText}>Help & Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone Section */}
        <View style={styles.dangerZoneSection}>
          <Text style={styles.dangerZoneHeader}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={() => router.push('/screens/CloseAccount')}>
            <UserX size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Close Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton} onPress={() => router.push('Logout')}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Footer (non-sticky) */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => router.push('PrivacyPolicy')}>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('TermsOfService')}>
              <Text style={styles.footerLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.footerLinkText}>© 2025 Safe-Locker</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingTop: 45,
    paddingBottom: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  profileSection: {
    // alignItems: 'center',
    // backgroundColor: '#F9FAFB',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E7EB',
    // position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
  },
  dangerZoneSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF5F5',
    borderTopWidth: 1,
    borderTopColor: '#EF4444',
  },
  dangerZoneHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingVertical: 2,
    paddingBottom: 3,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  footerLinkText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ProfilePanel;
