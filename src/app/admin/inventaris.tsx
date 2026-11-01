
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { router } from "expo-router";

// ==========================================
// DATA DUMMY INVENTARIS
// ==========================================

type BicycleStatus = "Tersedia" | "Sedang Disewa" | "Perawatan";

type Bicycle = {
  id: string;
  name: string;
  type: string;
  category: string;
  status: BicycleStatus;
  condition: string;
  qr: string;
  transaction?: string;
  duration?: string;
  mechanic?: string;
  estimatedFinish?: string;
};

const BICYCLES: Bicycle[] = [
  {
    id: "B-001",
    name: "Polygon Cascade 4",
    type: "MT",
    category: "Mountain Bike",
    status: "Tersedia",
    condition: "Sangat Baik (Ban & rem prima)",
    qr: "QR-B001",
  },
  {
    id: "B-003",
    name: "Dahon Mariner D8",
    type: "FOL",
    category: "Folding Bike",
    status: "Sedang Disewa",
    condition: "Baik",
    qr: "QR-B003",
    transaction: "TRX-00124",
    duration: "1j 45m",
  },
  {
    id: "B-014",
    name: "Polygon Bend R2",
    type: "GRAVE",
    category: "Mountain Bike",
    status: "Sedang Disewa",
    condition: "Baik",
    qr: "QR-B014",
    transaction: "TRX-00124",
    duration: "1j 45m",
  },
  {
    id: "B-021",
    name: "Polygon Premier 5",
    type: "MT",
    category: "Mountain Bike",
    status: "Perawatan",
    condition: "Cek setelan rantai & kabel rem",
    qr: "QR-B021",
    mechanic: "Mas Joko",
    estimatedFinish: "Hari ini",
  },
  {
    id: "B-008",
    name: "Phoenix City Classic",
    type: "CIT",
    category: "City Bike",
    status: "Tersedia",
    condition: "Siap Pakai (Termasuk Keranjang)",
    qr: "QR-B008",
  },
];

const FILTERS = [
  "Semua Tipe",
  "Mountain Bike",
  "Folding Bike",
  "City Bike",
];

// ==========================================
// INVENTARIS PAGE
// ==========================================

export default function InventoryScreen() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Semua Tipe");

  const filteredBicycles = useMemo(() => {
    return BICYCLES.filter((bike) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        bike.id.toLowerCase().includes(keyword) ||
        bike.name.toLowerCase().includes(keyword) ||
        bike.category.toLowerCase().includes(keyword);

      const matchesFilter =
        selectedFilter === "Semua Tipe" ||
        bike.category === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilter]);

  const handleAddBicycle = () => {
    Alert.alert(
      "Tambah Sepeda",
      "Halaman formulir tambah sepeda akan dibuat pada tahap berikutnya."
    );
  };

  const handleDetail = (bike: Bicycle) => {
    Alert.alert(
      bike.name,
      `ID: ${bike.id}\nKategori: ${bike.category}\nStatus: ${bike.status}\nKondisi: ${bike.condition}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileIcon}>♙</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.brandName}>
            Rental Sepeda Mas Joko
          </Text>
          <Text style={styles.adminName}>
            Admin Operasional Joko
          </Text>
        </View>

        <TouchableOpacity style={styles.calendarButton}>
          <Text style={styles.calendarIcon}>▣</Text>
        </TouchableOpacity>
      </View>

      {/* TOOLBAR */}
      <View style={styles.toolbar}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Inventaris</Text>
            <View style={styles.titleDot} />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddBicycle}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>
              + Tambah Sepeda
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID sepeda atau tipe..."
            placeholderTextColor="#727B87"
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Scan QR",
                "Fitur pemindaian QR akan dihubungkan pada tahap berikutnya."
              )
            }
          >
            <Text style={styles.qrIcon}>▦</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Tipe:</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  active && styles.activeFilterChip,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* BICYCLE LIST */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBicycles.length > 0 ? (
          filteredBicycles.map((bike) => (
            <TouchableOpacity
              key={bike.id}
              style={styles.bicycleCard}
              activeOpacity={0.9}
              onPress={() => handleDetail(bike)}
            >
              {/* BIKE IMAGE PLACEHOLDER */}
              <View style={styles.bikeImage}>
                <Text style={styles.bikeEmoji}>🚲</Text>
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>
                    {bike.type}
                  </Text>
                </View>
              </View>

              {/* BIKE INFORMATION */}
              <View style={styles.bikeInformation}>
                <View style={styles.bikeTopRow}>
                  <Text style={styles.bikeId}>
                    {bike.id}
                  </Text>

                  <StatusBadge status={bike.status} />
                </View>

                <Text style={styles.bikeName}>
                  {bike.name}
                </Text>

                {bike.status === "Tersedia" && (
                  <Text style={styles.conditionText}>
                    Kondisi: {bike.condition}
                  </Text>
                )}

                {bike.status === "Sedang Disewa" && (
                  <Text style={styles.rentedInfo}>
                    Disewa:{" "}
                    <Text style={styles.transactionText}>
                      {bike.transaction}
                    </Text>
                  </Text>
                )}

                {bike.status === "Perawatan" && (
                  <Text style={styles.maintenanceInfo}>
                    Kondisi: {bike.condition}
                  </Text>
                )}

                <View style={styles.cardDivider} />

                {bike.status === "Tersedia" && (
                  <View style={styles.cardFooter}>
                    <Text style={styles.locationText}>
                      ♧ Lokasi Rental Mas Joko
                    </Text>

                    <Text style={styles.qrText}>
                      ◉ {bike.qr}
                    </Text>
                  </View>
                )}

                {bike.status === "Sedang Disewa" && (
                  <View style={styles.cardFooter}>
                    <Text style={styles.durationText}>
                      ◷ Sisa {bike.duration}
                    </Text>
                  </View>
                )}

                {bike.status === "Perawatan" && (
                  <View style={styles.maintenanceFooter}>
                    <Text style={styles.mechanicText}>
                      🔧 Mekanik: {bike.mechanic}
                    </Text>

                    <Text style={styles.finishText}>
                      Est. Selesai {bike.estimatedFinish}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚲</Text>
            <Text style={styles.emptyTitle}>
              Sepeda tidak ditemukan
            </Text>
            <Text style={styles.emptyDescription}>
              Coba gunakan kata kunci atau tipe sepeda lain.
            </Text>
          </View>
        )}

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavigation}>
        <NavItem
          icon="▦"
          label="Dashboard"
          active={false}
          onPress={() => router.push("/admin/dashboard")}
        />

        <NavItem
          icon="🚲"
          label="Inventaris"
          active={true}
          onPress={() => router.push("/admin/inventaris")}
        />

        <NavItem
          icon="▤"
          label="Transaksi"
          active={false}
          onPress={() => router.push("/admin/penyewaan")}
        />

        <NavItem
          icon="•••"
          label="Lainnya"
          active={false}
          onPress={() => router.push("/admin/lainnya")}
        />
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// ATOM: STATUS BADGE
// ==========================================

function StatusBadge({ status }: { status: BicycleStatus }) {
  const statusStyles = {
    "Tersedia": {
      backgroundColor: "#DCF8E9",
      color: "#16804C",
      dot: "#16A765",
    },
    "Sedang Disewa": {
      backgroundColor: "#DFF1FB",
      color: "#176C96",
      dot: "#168FC4",
    },
    "Perawatan": {
      backgroundColor: "#FFF2CF",
      color: "#A56A12",
      dot: "#E8A51C",
    },
  };

  const current = statusStyles[status];

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: current.backgroundColor },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: current.dot },
        ]}
      />
      <Text style={[styles.statusText, { color: current.color }]}>
        {status}
      </Text>
    </View>
  );
}

// ==========================================
// MOLECULE: BOTTOM NAV ITEM
// ==========================================

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
    >
      <Text
        style={[
          styles.navIcon,
          active && styles.navIconActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navText,
          active && styles.navTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  header: {
    height: 67,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 19,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#D5DCE4",
  },

  profileCircle: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#D6F0FA",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 24,
    color: "#267D9C",
  },

  headerText: {
    flex: 1,
    marginLeft: 10,
  },

  brandName: {
    color: "#176985",
    fontSize: 19,
    fontWeight: "700",
  },

  adminName: {
    color: "#58616B",
    fontSize: 13,
    marginTop: 1,
  },

  calendarButton: {
    padding: 8,
  },

  calendarIcon: {
    color: "#394B5B",
    fontSize: 24,
  },

  toolbar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 19,
    paddingTop: 17,
    paddingBottom: 17,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#17283C",
  },

  titleDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#176985",
    marginTop: 6,
  },

  addButton: {
    width: 164,
    height: 49,
    borderRadius: 13,
    backgroundColor: "#36B9E8",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  searchContainer: {
    height: 54,
    borderWidth: 1.3,
    borderColor: "#C9D1DC",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  searchIcon: {
    fontSize: 27,
    color: "#535D68",
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#273849",
    paddingVertical: 8,
  },

  qrIcon: {
    fontSize: 24,
    color: "#65717E",
    paddingLeft: 8,
  },

  filterSection: {
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 19,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E6EC",
  },

  filterLabel: {
    fontSize: 12,
    color: "#7B828A",
    marginRight: 8,
  },

  filterContent: {
    alignItems: "center",
    paddingRight: 15,
    gap: 7,
  },

  filterChip: {
    backgroundColor: "#F0F2F7",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },

  activeFilterChip: {
    backgroundColor: "#CDEBFC",
  },

  filterText: {
    color: "#505A65",
    fontSize: 12,
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#17465F",
    fontWeight: "700",
  },

  listContainer: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 19,
    paddingTop: 13,
  },

  bicycleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CFD7E0",
    padding: 13,
    marginBottom: 13,
    flexDirection: "row",
    minHeight: 178,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },

  bikeImage: {
    width: 114,
    height: 114,
    backgroundColor: "#EAF0F5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    position: "relative",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E1E6EC",
  },

  bikeEmoji: {
    fontSize: 49,
  },

  typeTag: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "#485562",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },

  typeTagText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  bikeInformation: {
    flex: 1,
    minWidth: 0,
  },

  bikeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    gap: 4,
  },

  bikeId: {
    backgroundColor: "#E1EAFE",
    color: "#23648A",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusBadge: {
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    flexShrink: 1,
  },

  bikeName: {
    color: "#176985",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
    marginBottom: 2,
  },

  conditionText: {
    color: "#414B55",
    fontSize: 12,
    lineHeight: 17,
  },

  rentedInfo: {
    color: "#236C91",
    fontSize: 12,
  },

  transactionText: {
    color: "#48515B",
  },

  maintenanceInfo: {
    color: "#A66520",
    fontSize: 12,
    lineHeight: 17,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#E4E8ED",
    marginTop: 8,
    marginBottom: 8,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 5,
  },

  locationText: {
    color: "#59636D",
    fontSize: 11,
  },

  qrText: {
    color: "#16805D",
    fontSize: 11,
  },

  durationText: {
    color: "#38758E",
    fontSize: 12,
    fontWeight: "600",
  },

  maintenanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },

  mechanicText: {
    color: "#A66520",
    fontSize: 11,
    flex: 1,
  },

  finishText: {
    color: "#A66520",
    fontSize: 10,
    backgroundColor: "#FFFAE8",
    borderWidth: 1,
    borderColor: "#F5E4A6",
    borderRadius: 5,
    padding: 5,
    flex: 1,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 65,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#25394B",
    fontWeight: "700",
    fontSize: 16,
  },

  emptyDescription: {
    color: "#7B8490",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },

  bottomNavigation: {
    height: 67,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#D5DCE4",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    color: "#777F88",
    fontSize: 22,
    marginBottom: 3,
  },

  navIconActive: {
    color: "#176985",
  },

  navText: {
    color: "#515B65",
    fontSize: 12,
  },

  navTextActive: {
    color: "#176985",
    fontWeight: "700",
  },
});
