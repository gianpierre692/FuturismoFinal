import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos para el PDF - Formato original ajustado para 1 hoja
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 25,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#2563eb',
  },
  headerContent: {
    alignItems: 'center',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleBox: {
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  titleSubtext: {
    fontSize: 9,
    color: '#1e40af',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 2,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#6b7280',
    fontSize: 9,
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 9,
  },
  teamSection: {
    marginBottom: 12,
  },
  teamTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  teamGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamMember: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    flex: 0.31,
    alignItems: 'center',
    minHeight: 140,
  },
  guideCard: {
    borderColor: '#bfdbfe',
  },
  driverCard: {
    borderColor: '#bbf7d0',
  },
  vehicleCard: {
    borderColor: '#e9d5ff',
  },
  memberPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
    borderWidth: 3,
  },
  guidePhoto: {
    borderColor: '#3b82f6',
  },
  driverPhoto: {
    borderColor: '#10b981',
  },
  vehiclePhoto: {
    borderColor: '#8b5cf6',
    borderRadius: 6,
  },
  memberRole: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    textAlign: 'center',
  },
  guideRole: {
    color: '#1e40af',
  },
  driverRole: {
    color: '#059669',
  },
  vehicleRole: {
    color: '#7c3aed',
  },
  memberName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  memberDetails: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    fontSize: 8,
  },
  detailLabel: {
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  memberFeatures: {
    marginTop: 4,
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'center',
  },
  notesBox: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesText: {
    fontSize: 9,
    color: '#92400e',
  },
  emergencySection: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#991b1b',
    textAlign: 'center',
    marginBottom: 6,
  },
  emergencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 4,
    padding: 6,
    flex: 0.48,
  },
  emergencyBoxTitle: {
    fontWeight: 'bold',
    color: '#991b1b',
    fontSize: 9,
    marginBottom: 2,
  },
  emergencyContact: {
    color: '#991b1b',
    fontSize: 8,
    marginBottom: 1,
  },
  footer: {
    borderTopWidth: 2,
    borderTopColor: '#2563eb',
    paddingTop: 8,
    marginTop: 'auto',
  },
  footerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  footerBox: {
    flex: 0.31,
  },
  footerTitle: {
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 9,
    marginBottom: 2,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 8,
    marginBottom: 1,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 6,
    alignItems: 'center',
  },
  footerBottomText: {
    color: '#9ca3af',
    fontSize: 7,
    marginBottom: 1,
  },
});

const TourAssignmentBrochurePDF = ({ assignment }) => {
  const {
    tourDate,
    tourTime,
    tourName,
    groupSize,
    agency,
    guide,
    driver,
    vehicle,
    pickupLocation,
    notes
  } = assignment || {};

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('es-PE'),
      time: now.toLocaleTimeString('es-PE')
    };
  };

  const current = getCurrentDateTime();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.companyName}>🌎 FUTURISMO TOURS</Text>
            <Text style={styles.subtitle}>Sistema de Gestión Turística B2B</Text>
            <View style={styles.titleBox}>
              <Text style={styles.titleText}>ASIGNACIÓN DE TOUR</Text>
              <Text style={styles.titleSubtext}>Información detallada del servicio asignado</Text>
            </View>
          </View>
        </View>

        {/* Tour Information Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>📅 Información del Tour</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tour:</Text>
              <Text style={styles.infoValue}>{tourName || 'No especificado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha:</Text>
              <Text style={styles.infoValue}>{formatDate(tourDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hora:</Text>
              <Text style={styles.infoValue}>{tourTime || 'No especificada'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Grupo:</Text>
              <Text style={styles.infoValue}>{groupSize || 0} personas</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Agencia:</Text>
              <Text style={[styles.infoValue, { color: '#2563eb' }]}>{agency?.name || 'No especificada'}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>📍 Punto de Encuentro</Text>
            <Text style={[styles.infoValue, { fontSize: 10, marginBottom: 4 }]}>
              {pickupLocation?.name || 'No especificado'}
            </Text>
            <Text style={[styles.infoLabel, { fontSize: 8, marginBottom: 2 }]}>
              {pickupLocation?.address || 'Dirección no especificada'}
            </Text>
            <Text style={[styles.infoLabel, { fontSize: 8 }]}>
              Referencia: {pickupLocation?.reference || 'No especificada'}
            </Text>
          </View>
        </View>

        {/* Team Assignment */}
        <View style={styles.teamSection}>
          <Text style={styles.teamTitle}>EQUIPO ASIGNADO</Text>
          
          <View style={styles.teamGrid}>
            {/* Guide */}
            <View style={[styles.teamMember, styles.guideCard]}>
              <View style={[styles.memberPhoto, styles.guidePhoto]} />
              <Text style={[styles.memberRole, styles.guideRole]}>GUÍA TURÍSTICO</Text>
              <Text style={styles.memberName}>{guide?.name || 'No asignado'}</Text>
              
              <View style={styles.memberDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Teléfono:</Text>
                  <Text style={styles.detailValue}>{guide?.phone || 'No disponible'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Licencia:</Text>
                  <Text style={styles.detailValue}>{guide?.license || 'No disponible'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Rating:</Text>
                  <Text style={styles.detailValue}>{guide?.rating || 'N/A'} ⭐</Text>
                </View>
              </View>
              
              <Text style={styles.memberFeatures}>
                Especialidades: {guide?.specialties?.join(', ') || 'No especificadas'}
              </Text>
              <Text style={styles.memberFeatures}>
                Idiomas: {guide?.languages?.join(', ') || 'No especificados'}
              </Text>
            </View>

            {/* Driver */}
            <View style={[styles.teamMember, styles.driverCard]}>
              <View style={[styles.memberPhoto, styles.driverPhoto]} />
              <Text style={[styles.memberRole, styles.driverRole]}>CHOFER</Text>
              <Text style={styles.memberName}>{driver?.name || 'No asignado'}</Text>
              
              <View style={styles.memberDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Teléfono:</Text>
                  <Text style={styles.detailValue}>{driver?.phone || 'No disponible'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Licencia:</Text>
                  <Text style={styles.detailValue}>{driver?.license || 'No disponible'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Experiencia:</Text>
                  <Text style={styles.detailValue}>{driver?.experience || 'N/A'} años</Text>
                </View>
              </View>
              
              <Text style={styles.memberFeatures}>
                Certificaciones: {driver?.certifications?.join(', ') || 'No especificadas'}
              </Text>
            </View>

            {/* Vehicle */}
            <View style={[styles.teamMember, styles.vehicleCard]}>
              <View style={[styles.memberPhoto, styles.vehiclePhoto]} />
              <Text style={[styles.memberRole, styles.vehicleRole]}>VEHÍCULO</Text>
              <Text style={styles.memberName}>
                {vehicle?.brand || 'No'} {vehicle?.model || 'asignado'}
              </Text>
              
              <View style={styles.memberDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Placa:</Text>
                  <Text style={styles.detailValue}>{vehicle?.plate || 'No disponible'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Año:</Text>
                  <Text style={styles.detailValue}>{vehicle?.year || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Color:</Text>
                  <Text style={styles.detailValue}>{vehicle?.color || 'No especificado'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Capacidad:</Text>
                  <Text style={styles.detailValue}>{vehicle?.capacity || 'N/A'} pax</Text>
                </View>
              </View>
              
              <Text style={styles.memberFeatures}>
                Características: {vehicle?.features?.join(', ') || 'No especificadas'}
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notes */}
        {notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>⚠️ NOTAS IMPORTANTES</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        {/* Emergency Contacts */}
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>🚨 CONTACTOS DE EMERGENCIA</Text>
          <View style={styles.emergencyGrid}>
            <View style={styles.emergencyBox}>
              <Text style={styles.emergencyBoxTitle}>Central Futurismo</Text>
              <Text style={styles.emergencyContact}>📞 +51 999 999 999</Text>
              <Text style={styles.emergencyContact}>📧 emergencias@futurismo.com</Text>
            </View>
            <View style={styles.emergencyBox}>
              <Text style={styles.emergencyBoxTitle}>Coordinador de Turno</Text>
              <Text style={styles.emergencyContact}>📞 +51 888 888 888</Text>
              <Text style={styles.emergencyContact}>WhatsApp: +51 777 777 777</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerGrid}>
            <View style={styles.footerBox}>
              <Text style={styles.footerTitle}>Dirección</Text>
              <Text style={styles.footerText}>Av. Larco 123, Miraflores</Text>
              <Text style={styles.footerText}>Lima, Perú</Text>
            </View>
            <View style={styles.footerBox}>
              <Text style={styles.footerTitle}>Contacto</Text>
              <Text style={styles.footerText}>📞 +51 999 999 999</Text>
              <Text style={styles.footerText}>📧 info@futurismo.com</Text>
            </View>
            <View style={styles.footerBox}>
              <Text style={styles.footerTitle}>Web</Text>
              <Text style={styles.footerText}>🌐 www.futurismo.com</Text>
              <Text style={styles.footerText}>📱 @futurismotours</Text>
            </View>
          </View>
          
          <View style={styles.footerBottom}>
            <Text style={styles.footerBottomText}>
              Documento generado el {current.date} a las {current.time}
            </Text>
            <Text style={styles.footerBottomText}>
              © {new Date().getFullYear()} Futurismo Tours - Todos los derechos reservados
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TourAssignmentBrochurePDF;