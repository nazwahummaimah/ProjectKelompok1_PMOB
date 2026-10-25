import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* =====================================================
   COLOR
   ===================================================== */

const C = {
  green: '#16833B',
  darkGreen: '#07532C',
  deepGreen: '#064426',

  lightGreen: '#E8F6EC',
  paleGreen: '#F1FAF3',

  white: '#FFFFFF',
  background: '#F7F9F8',

  secondary: '#61766A',
  muted: '#87988E',

  border: '#E5ECE7',

  success: '#10A65A',
  warning: '#EF6C00',
  error: '#C62828',
};

/* =====================================================
   BOTTOM NAV ITEM
   ===================================================== */

function BottomNavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.bottomNavItem}
      accessibilityRole="button"
    >
      <Ionicons
        name={icon}
        size={23}
        color={active ? C.green : C.muted}
      />

      <Text
        style={[
          styles.bottomNavLabel,
          active && styles.bottomNavLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* =====================================================
   DURASI SEWA
   ===================================================== */

export default function DurasiSewa() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <View style={styles.container}>

        {/* =================================================
           HEADER
           ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="qr-code-outline"
              size={27}
              color={C.green}
            />
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>
              Durasi Penyewaan
            </Text>

            <Text style={styles.headerSubtitle}>
              Cek durasi sepeda yang ingin anda sewa
            </Text>
          </View>
        </View>

        {/* =================================================
           CONTENT
           ================================================= */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ================= INTRO ================= */}

          <View style={styles.intro}>
            <Text style={styles.pageTitle}>
              Scan QR pada sepeda
            </Text>

            <Text style={styles.pageDescription}>
              Arahkan kamera pada QR Code yang terdapat
              pada sepeda untuk melihat status dan
              durasi sewa.
            </Text>
          </View>

          {/* ================= SCAN CARD ================= */}

          <View style={styles.scanCard}>

            <View style={styles.scanCardHeader}>
              <View style={styles.scanIconCircle}>
                <Ionicons
                  name="scan-outline"
                  size={22}
                  color={C.green}
                />
              </View>

              <View style={styles.scanCardHeaderText}>
                <Text style={styles.scanTitle}>
                  Scan QR Code
                </Text>

                <Text style={styles.scanSubtitle}>
                  Posisikan QR di dalam kotak
                </Text>
              </View>
            </View>

            {/* ================= CAMERA ================= */}

            <View style={styles.cameraContainer}>
              <View style={styles.scanFrame}>

                {/* Top Left */}
                <View style={styles.cornerTopLeft} />

                {/* Top Right */}
                <View style={styles.cornerTopRight} />

                {/* Bottom Left */}
                <View style={styles.cornerBottomLeft} />

                {/* Bottom Right */}
                <View style={styles.cornerBottomRight} />

                <Ionicons
                  name="camera-outline"
                  size={38}
                  color="#FFFFFF"
                />

                <Text style={styles.cameraText}>
                  Kamera
                </Text>

              </View>
            </View>

            {/* ================= CAMERA STATUS ================= */}

            <View style={styles.cameraStatus}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                Kamera siap digunakan
              </Text>
            </View>

          </View>

          {/* ================= INFO ================= */}

          <View style={styles.infoCard}>

            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={C.green}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Cara menggunakan
              </Text>

              <Text style={styles.infoText}>
                Scan QR Code pada sepeda. Setelah QR
                berhasil dibaca, informasi status sepeda
                dan durasi sewa akan ditampilkan.
              </Text>
            </View>

          </View>

          {/* ================= EXTRA SPACE ================= */}

          <View style={styles.bottomContentSpace} />

        </ScrollView>

        {/* =================================================
           BOTTOM NAVIGATION
           ================================================= */}

        <View style={styles.bottomNav}>

          <BottomNavItem
            icon="home"
            label="Home"
            onPress={() => router.replace('/public')}
          />

          <BottomNavItem
            icon="scan-outline"
            label="Durasi Sewa"
            active
            onPress={() =>
              router.replace('/public/durasi-sewa')
            }
          />

          <BottomNavItem
            icon="person-circle-outline"
            label="Login"
            onPress={() =>
              router.replace('/public/login')
            }
          />

        </View>

      </View>
    </SafeAreaView>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

  /* ================= MAIN LAYOUT ================= */

  safeArea: {
    flex: 1,
    backgroundColor: C.white,
  },

  container: {
    flex: 1,
    backgroundColor: C.background,
  },

  scroll: {
    flex: 1,
    backgroundColor: C.background,
  },

  scrollContent: {
    paddingBottom: 22,
  },

  /* ================= HEADER ================= */

  header: {
    minHeight: 66,
    backgroundColor: C.white,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,

    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
  },

  headerIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: C.lightGreen,

    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTextWrap: {
    flex: 1,
    marginLeft: 10,
  },

  headerTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: C.green,
  },

  headerSubtitle: {
    fontSize: 10,
    color: C.secondary,
    marginTop: 1,
  },

  /* ================= INTRO ================= */

  intro: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 12,
  },

  pageTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: C.deepGreen,
  },

  pageDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: C.secondary,
    marginTop: 5,
    maxWidth: 330,
  },

  /* ================= SCAN CARD ================= */

  scanCard: {
    marginHorizontal: 10,

    padding: 13,

    borderRadius: 15,

    backgroundColor: C.white,

    borderWidth: 1,
    borderColor: '#EEF2EF',

    shadowColor: '#203E2C',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 2,
  },

  scanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  scanIconCircle: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: C.lightGreen,

    alignItems: 'center',
    justifyContent: 'center',
  },

  scanCardHeaderText: {
    marginLeft: 9,
  },

  scanTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.deepGreen,
  },

  scanSubtitle: {
    fontSize: 9.5,
    color: C.secondary,
    marginTop: 2,
  },

  /* ================= CAMERA ================= */

  cameraContainer: {
    width: '100%',
    aspectRatio: 1,

    maxHeight: 310,

    borderRadius: 14,

    backgroundColor: '#202522',

    overflow: 'hidden',

    alignItems: 'center',
    justifyContent: 'center',
  },

  scanFrame: {
    width: '66%',
    aspectRatio: 1,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },

  cameraText: {
    color: '#FFFFFF',

    fontSize: 10,

    fontWeight: '600',

    marginTop: 5,
  },

  /* ================= SCAN CORNERS ================= */

  cornerTopLeft: {
    position: 'absolute',

    top: 0,
    left: 0,

    width: 32,
    height: 32,

    borderTopWidth: 3,
    borderLeftWidth: 3,

    borderColor: C.green,
  },

  cornerTopRight: {
    position: 'absolute',

    top: 0,
    right: 0,

    width: 32,
    height: 32,

    borderTopWidth: 3,
    borderRightWidth: 3,

    borderColor: C.green,
  },

  cornerBottomLeft: {
    position: 'absolute',

    bottom: 0,
    left: 0,

    width: 32,
    height: 32,

    borderBottomWidth: 3,
    borderLeftWidth: 3,

    borderColor: C.green,
  },

  cornerBottomRight: {
    position: 'absolute',

    bottom: 0,
    right: 0,

    width: 32,
    height: 32,

    borderBottomWidth: 3,
    borderRightWidth: 3,

    borderColor: C.green,
  },

  /* ================= CAMERA STATUS ================= */

  cameraStatus: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 10,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: C.success,

    marginRight: 5,
  },

  statusText: {
    fontSize: 9.5,
    color: C.secondary,
  },

  /* ================= INFO ================= */

  infoCard: {
    marginHorizontal: 10,
    marginTop: 10,

    padding: 12,

    borderRadius: 15,

    backgroundColor: '#EAF7ED',

    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: '#D5EFD9',

    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 9,
  },

  infoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: C.deepGreen,
  },

  infoText: {
    fontSize: 9.5,
    lineHeight: 14,

    color: C.secondary,

    marginTop: 3,
  },

  /* ================= BOTTOM CONTENT ================= */

  bottomContentSpace: {
    height: 10,
  },

  /* ================= BOTTOM NAV ================= */

  bottomNav: {
    height: 65,

    flexDirection: 'row',

    backgroundColor: C.white,

    borderTopWidth: 1,
    borderTopColor: '#EDF1EE',

    justifyContent: 'space-around',
    alignItems: 'center',

    paddingHorizontal: 10,
  },

  bottomNavItem: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 3,
  },

  bottomNavLabel: {
    color: '#819099',

    fontSize: 10,

    fontWeight: '600',
  },

  bottomNavLabelActive: {
    color: C.green,

    fontWeight: '800',
  },

});