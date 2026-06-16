import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,             
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    color: '#1E293B',
    fontSize: 8.5,           
    lineHeight: 1.3,        
  },

  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#0D2C54',
    paddingBottom: 4,        
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    flexDirection: 'column',
    width: '60%',
  },

  headerLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    width: '40%',
  },

  logoImg: {
    height: 42,             
    width: 105,
    objectFit: 'contain',
  },

  title: {
    fontSize: 18,           
    fontWeight: 'bold',
    color: '#0D2C54',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 8,
    color: '#C3002F',
    fontWeight: 'bold',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  gridContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  card: {
    flex: 1,
    padding: 8,             
    borderRadius: 4,
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
  },

  cardLabel: {
    fontSize: 7,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 2,
  },

  cardValue: {
    fontSize: 12,           
    fontWeight: 'bold',
    color: '#0F172A',
  },

  sectionTitle: {
    fontSize: 10,           
    fontWeight: 'bold',
    color: '#0D2C54',
    marginBottom: 4,
    marginTop: 6,
  },

  chartsFlexRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    width: '100%',
  },

  chartPlaceholder: {
    height: 90,             
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  placeholderText: {
    fontSize: 8,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },

  table: {
    width: '100%',
    marginTop: 2,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0D2C54',
    padding: 5,
    borderRadius: 2,
  },

  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 5,
    alignItems: 'center',
    wrap: false,            
  },

  cellDescription: {
    flex: 3,            
    fontSize: 8,
    color: '#334155',
  },

  cellValue: {
    flex: 1,             
    fontSize: 8,
    textAlign: 'right', 
    color: '#334155',
  },

  recommendationBox: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#FFF1F2',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#C3002F',
    wrap: false,
  },

  recommendationTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#C3002F',
    marginBottom: 2,
  },

  recommendationText: {
    fontSize: 7.5,           
    color: '#475569',
    lineHeight: 1.3,
    textAlign: 'justify',
  },

  footer: {
    position: 'absolute',
    bottom: 20,              
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#94A3B8',
  },
});