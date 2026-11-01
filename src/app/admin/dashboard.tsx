
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

// ==========================================
// DATA INVENTARIS
// ==========================================

const INVENTORY = {
  total: 20,
  tersedia: 14,
  disewa: 4,
  perawatan: 2,
};

// ==========================================
// DATA AKTIVITAS HARI INI
// ==========================================

const DAILY_ACTIVITY = {
  transaksi: 14,
  kembali: 9,
  pemasukan: "Rp450K",
};

// ==========================================
// DATA TRANSAKSI AKTIF
// ==========================================

const ACTIVE_RENTALS = [
  {
    id: "TRX-00124",
    customer: "Budi Santoso",
    bicycles: 2,
    bicycleNames: "Polygon Cascade 4, Bend R2",
    startTime: "14:20 WIB",
    duration: "01 jam 35 m",
  },
  {
    id: "TRX-00127",
    customer: "Siti Rahmawati",
    bicycles: 1,
    bicycleNames: "Phoenix City",
    startTime: "15:10 WIB",
    duration: "45 menit",
  },
  {
    id: "TRX-00129",
    customer: "Hendra Setiawan",
    bicycles: 1,
    bicycleNames: "Selis E-City",
    startTime: "15:35 WIB",
    duration: "20 menit",
  },
];

// ==========================================
// MAIN DASHBOARD
// ==========================================

export default function AdminDashboard() {
  const navigate = (path: string) => {
    router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>MJ</Text>
          </View>

          <View style={styles.brandContainer}>
            <Text style={styles.brandName}>
              Rental Sepeda Mas Joko
            </Text>

            <View style={styles.onlineContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.calendarIcon}>▣</Text>
          <Text style={styles.dateText}>
            1 Nov{"\n"}2026
          </Text>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* RINGKASAN ARMADA */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              RINGKASAN ARMADA
            </Text>

            <Text style={styles.sectionTitle}>
              Ketersediaan Unit
            </Text>
          </View>

          <View style={styles.realtimeContainer}>
            <Text style={styles.realtimeIcon}>⟳</Text>
            <Text style={styles.realtimeText}>Realtime</Text>
          </View>
        </View>

        {/* INVENTORY CARDS */}
        <View style={styles.inventoryGrid}>

          {/* TOTAL */}
          <View style={styles.inventoryCard}>
            <View style={styles.cardTop}>
              <Text style={styles.cardLabel}>
                Total Sepeda
              </Text>

              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>🚲</Text>
              </View>
            </View>

            <View style={styles.totalValueContainer}>
              <Text style={styles.totalValue}>
                {INVENTORY.total}
              </Text>
              <Text style={styles.unitText}>Unit</Text>
            </View>
          </View>

          {/* TERSEDIA */}
          <View style={styles.inventoryCard}>
            <View style={styles.cardTop}>
              <Text style={styles.availableLabel}>
                Tersedia
              </Text>

              <View style={styles.availableDot} />
            </View>

            <View style={styles.valueContainer}>
              <Text style={styles.availableValue}>
                {INVENTORY.tersedia}
              </Text>
              <Text style={styles.availableUnit}>Unit</Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.availableSmallDot} />
              <Text style={styles.availablePillText}>
                Siap disewa
              </Text>
            </View>
          </View>

          {/* SEDANG DISEWA */}
          <View style={styles.inventoryCard}>
            <View style={styles.cardTop}>
              <Text style={styles.rentedLabel}>
                Sedang Disewa
              </Text>

              <Text style={styles.statusIcon}>◷</Text>
            </View>

            <View style={styles.valueContainer}>
              <Text style={styles.rentedValue}>
                {INVENTORY.disewa}
              </Text>
              <Text style={styles.rentedUnit}>Unit</Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.rentedSmallDot} />
              <Text style={styles.rentedPillText}>
                Sedang digunakan
              </Text>
            </View>
          </View>

          {/* PERAWATAN */}
          <View style={styles.inventoryCard}>
            <View style={styles.cardTop}>
              <Text style={styles.maintenanceLabel}>
                Perawatan
              </Text>

              <Text style={styles.statusIcon}>🔧</Text>
            </View>

            <View style={styles.valueContainer}>
              <Text style={styles.maintenanceValue}>
                {INVENTORY.perawatan}
              </Text>
              <Text style={styles.maintenanceUnit}>Unit</Text>
            </View>

            <View style={styles.statusPill}>
              <Text style={styles.maintenancePillText}>
                Bengkel & Cek
              </Text>
            </View>
          </View>
        </View>

        {/* AKTIVITAS HARI INI */}
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>
              Aktivitas Hari Ini
            </Text>

            <Text style={styles.activityDate}>
              Minggu, 1 Nov 2026
            </Text>
          </View>

          <View style={styles.activityDivider} />

          <View style={styles.activityGrid}>
            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>
                Transaksi
              </Text>

              <Text style={styles.activityValue}>
                {DAILY_ACTIVITY.transaksi}
              </Text>

              <Text style={styles.activityDescription}>
                Berhasil
              </Text>
            </View>

            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>
                Kembali
              </Text>

              <Text style={styles.activityValue}>
                {DAILY_ACTIVITY.kembali}
              </Text>

              <Text style={styles.activityDescription}>
                Unit aman
              </Text>
            </View>

            <View style={styles.activityItem}>
              <Text style={styles.activityLabel}>
                Pemasukan
              </Text>

              <Text style={styles.incomeValue}>
                {DAILY_ACTIVITY.pemasukan}
              </Text>

              <Text style={styles.activityDescription}>
                Transaksi lunas
              </Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTION */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigate("/admin/penyewaan")}
          >
            <Text style={styles.primaryButtonIcon}>⊕</Text>
            <Text style={styles.primaryButtonText}>
              Buat Transaksi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => navigate("/admin/sepeda")}
          >
            <Text style={styles.secondaryButtonIcon}>▤</Text>
            <Text style={styles.secondaryButtonText}>
              Kelola Inventaris
            </Text>
          </TouchableOpacity>
        </View>

        {/* ACTIVE RENTALS */}
        <View style={styles.rentalSectionHeader}>
          <View style={styles.rentalTitleContainer}>
            <Text style={styles.rentalSectionTitle}>
              Sewa Sedang Berjalan
            </Text>

            <View style={styles.rentalCount}>
              <Text style={styles.rentalCountText}>
                {ACTIVE_RENTALS.length}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigate("/admin/penyewaan")}
          >
            <Text style={styles.seeAllText}>
              Lihat Semua
            </Text>
          </TouchableOpacity>
        </View>

        {/* RENTAL LIST */}
        {ACTIVE_RENTALS.map((rental) => (
          <TouchableOpacity
            key={rental.id}
            style={styles.rentalCard}
            activeOpacity={0.8}
            onPress={() =>
              navigate("/admin/penyewaan")
            }
          >
            <View style={styles.rentalTop}>
              <Text style={styles.transactionId}>
                {rental.id}
              </Text>

              <View style={styles.rentalStatus}>
                <View style={styles.rentalStatusDot} />
                <Text style={styles.rentalStatusText}>
                  Sedang Disewa
                </Text>
              </View>

              <Text style={styles.rentalArrow}>›</Text>
            </View>

            <Text style={styles.customerName}>
              {rental.customer}
            </Text>

            <View style={styles.bicycleInfo}>
              <Text style={styles.bicycleIcon}>🚲</Text>

              <Text style={styles.bicycleText}>
                {rental.bicycles} sepeda{" "}
                <Text style={styles.bicycleName}>
                  ({rental.bicycleNames})
                </Text>
              </Text>
            </View>

            <View style={styles.rentalDivider} />

            <View style={styles.rentalBottom}>
              <Text style={styles.rentalTime}>
                ◷ Mulai {rental.startTime}
              </Text>

              <Text style={styles.rentalDuration}>
                ◴ Durasi: {rental.duration}
              </Text>
            </View>

            <Text style={styles.detailHint}>
              Ketuk untuk detail
            </Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate("/admin")}
        >
          <Text style={styles.navActiveIcon}>▦</Text>
          <Text style={styles.navActiveText}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate("/admin/inventaris")}
        >
          <Text style={styles.navIcon}>🚲</Text>
          <Text style={styles.navText}>
            Inventaris
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate("/admin/penyewaan")}
        >
          <Text style={styles.navIcon}>▤</Text>
          <Text style={styles.navText}>
            Transaksi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigate("/admin/lainnya")}
        >
          <Text style={styles.navIcon}>•••</Text>
          <Text style={styles.navText}>
            Lainnya
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// STYLING
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  header: {
    minHeight: 84,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#D9DFE8",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5EDF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCD8E5",
  },

  profileInitial: {
    fontSize: 15,
    fontWeight: "700",
    color: "#176985",
  },

  brandContainer: {
    marginLeft: 10,
    flex: 1,
  },

  brandName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#176985",
    lineHeight: 26,
  },

  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 2,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 5,
  },

  onlineText: {
    fontSize: 12,
    color: "#14785C",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3FC",
    borderWidth: 1,
    borderColor: "#D9DFEC",
    borderRadius: 11,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },

  calendarIcon: {
    color: "#176985",
    fontSize: 19,
    marginRight: 7,
  },

  dateText: {
    fontSize: 13,
    lineHeight: 17,
    color: "#354052",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 19,
    paddingTop: 25,
    paddingBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 21,
  },

  sectionEyebrow: {
    fontSize: 13,
    fontWeight: "600",
    color: "#525B67",
    letterSpacing: 0.6,
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#17283C",
  },

  realtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  realtimeIcon: {
    color: "#26758B",
    fontSize: 18,
    marginRight: 4,
  },

  realtimeText: {
    color: "#26758B",
    fontSize: 13,
  },

  inventoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 19,
  },

  inventoryCard: {
    width: "48.5%",
    minHeight: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C9D1DC",
    padding: 14,
    marginBottom: 12,
    justifyContent: "space-between",
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    fontSize: 14,
    color: "#4B5560",
  },

  cardIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
  },

  cardIconText: {
    fontSize: 18,
  },

  totalValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 12,
  },

  totalValue: {
    fontSize: 31,
    fontWeight: "700",
    color: "#17283C",
  },

  unitText: {
    fontSize: 13,
    color: "#4B5560",
    marginLeft: 5,
  },

  availableLabel: {
    color: "#28745E",
    fontSize: 14,
    fontWeight: "600",
  },

  availableDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#19B88A",
  },

  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 3,
  },

  availableValue: {
    color: "#15966F",
    fontSize: 38,
    fontWeight: "700",
  },

  availableUnit: {
    color: "#15966F",
    fontSize: 13,
    marginLeft: 5,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#EAF8F3",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  availableSmallDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#15966F",
    marginRight: 5,
  },

  availablePillText: {
    color: "#28745E",
    fontSize: 12,
  },

  rentedLabel: {
    color: "#226A91",
    fontSize: 14,
    fontWeight: "600",
  },

  statusIcon: {
    fontSize: 19,
  },

  rentedValue: {
    color: "#178BC1",
    fontSize: 38,
    fontWeight: "700",
  },

  rentedUnit: {
    color: "#178BC1",
    fontSize: 13,
    marginLeft: 5,
  },

  rentedSmallDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#178BC1",
    marginRight: 5,
  },

  rentedPillText: {
    color: "#226A91",
    fontSize: 12,
  },

  maintenanceLabel: {
    color: "#98531F",
    fontSize: 14,
    fontWeight: "600",
  },

  maintenanceValue: {
    color: "#E59A21",
    fontSize: 38,
    fontWeight: "700",
  },

  maintenanceUnit: {
    color: "#A76B24",
    fontSize: 13,
    marginLeft: 5,
  },

  maintenancePillText: {
    color: "#98531F",
    fontSize: 12,
  },

  activityCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9D1DC",
    borderRadius: 16,
    padding: 15,
    marginBottom: 23,
  },

  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#263749",
  },

  activityDate: {
    fontSize: 12,
    color: "#525B67",
  },

  activityDivider: {
    height: 1,
    backgroundColor: "#E2E6EB",
    marginTop: 12,
    marginBottom: 12,
  },

  activityGrid: {
    flexDirection: "row",
  },

  activityItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  activityLabel: {
    color: "#505B65",
    fontSize: 13,
  },

  activityValue: {
    color: "#17283C",
    fontSize: 23,
    fontWeight: "700",
    marginTop: 3,
  },

  incomeValue: {
    color: "#176985",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 3,
  },

  activityDescription: {
    color: "#747E89",
    fontSize: 11,
    marginTop: 3,
  },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 10,
  },

  primaryButton: {
    flex: 1,
    minHeight: 55,
    borderRadius: 14,
    backgroundColor: "#36B9E8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  primaryButtonIcon: {
    color: "#17364B",
    fontSize: 23,
    marginRight: 6,
  },

  primaryButtonText: {
    color: "#17364B",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    flex: 1,
    minHeight: 55,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#8996A3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryButtonIcon: {
    color: "#286D8C",
    fontSize: 22,
    marginRight: 7,
  },

  secondaryButtonText: {
    color: "#286D8C",
    fontSize: 14,
    fontWeight: "600",
  },

  rentalSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  rentalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rentalSectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#17283C",
  },

  rentalCount: {
    backgroundColor: "#D5EFFB",
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  rentalCountText: {
    color: "#176985",
    fontSize: 13,
    fontWeight: "700",
  },

  seeAllText: {
    color: "#176985",
    fontSize: 13,
    fontWeight: "600",
  },

  rentalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C9D1DC",
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  rentalTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionId: {
    color: "#28718B",
    fontSize: 12,
    fontWeight: "700",
  },

  rentalStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DFF1FB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginLeft: 9,
    flex: 1,
    maxWidth: 135,
  },

  rentalStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#168DC1",
    marginRight: 5,
  },

  rentalStatusText: {
    color: "#226A91",
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 1,
  },

  rentalArrow: {
    color: "#B2BBC5",
    fontSize: 25,
    marginLeft: "auto",
  },

  customerName: {
    color: "#17283C",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 9,
    marginBottom: 11,
  },

  bicycleInfo: {
    backgroundColor: "#F0F3FF",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  bicycleIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  bicycleText: {
    color: "#455264",
    fontSize: 13,
    flex: 1,
  },

  bicycleName: {
    color: "#17283C",
    fontWeight: "700",
  },

  rentalDivider: {
    height: 1,
    backgroundColor: "#E5E8EC",
    marginVertical: 10,
  },

  rentalBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rentalTime: {
    color: "#525B65",
    fontSize: 12,
  },

  rentalDuration: {
    color: "#286D8C",
    fontSize: 12,
    fontWeight: "600",
  },

  detailHint: {
    color: "#56869A",
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "right",
    marginTop: 9,
  },

  bottomNavigation: {
    minHeight: 66,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#D3DAE2",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 4,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },

  navActiveIcon: {
    fontSize: 23,
    color: "#176985",
    marginBottom: 2,
  },

  navActiveText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#176985",
  },

  navIcon: {
    fontSize: 22,
    color: "#7D858D",
    marginBottom: 3,
  },

  navText: {
    fontSize: 12,
    color: "#555E68",
  },
});
