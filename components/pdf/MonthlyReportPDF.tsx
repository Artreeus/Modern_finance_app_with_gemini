import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2px solid #22c55e',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#22c55e',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    summaryBox: {
        backgroundColor: '#f0fdf4',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
    },
    summaryValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1px solid #ddd',
        paddingBottom: 5,
        marginBottom: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottom: '1px solid #f0f0f0',
    },
    tableCol: {
        fontSize: 10,
    },
    col1: { width: '20%' },
    col2: { width: '15%' },
    col3: { width: '20%' },
    col4: { width: '20%' },
    col5: { width: '25%' },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
    },
});

interface PDFData {
    user: {
        name: string;
        email: string;
    };
    month: string;
    year: number;
    summary: {
        totalIncome: number;
        totalExpense: number;
        netSavings: number;
        breakdown: { category: string; amount: number }[];
    } | null;
    transactions: {
        date: string;
        type: string;
        category: string;
        amount: number;
        note: string;
    }[];
}

export const MonthlyReportPDF = ({ data }: { data: PDFData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Monthly Finance Report</Text>
                <Text style={styles.subtitle}>
                    {data.month} {data.year} - {data.user.name}
                </Text>
            </View>

            {/* Summary Section */}
            {data.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.summaryBox}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Income:</Text>
                            <Text style={styles.summaryValue}>
                                ৳{data.summary.totalIncome.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Expense:</Text>
                            <Text style={styles.summaryValue}>
                                ৳{data.summary.totalExpense.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Net Savings:</Text>
                            <Text
                                style={[
                                    styles.summaryValue,
                                    { color: data.summary.netSavings >= 0 ? '#22c55e' : '#ef4444' },
                                ]}
                            >
                                ৳{data.summary.netSavings.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Category Breakdown */}
            {data.summary && data.summary.breakdown.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category Breakdown</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCol, styles.col3]}>Category</Text>
                            <Text style={[styles.tableCol, styles.col4]}>Amount</Text>
                        </View>
                        {data.summary.breakdown.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCol, styles.col3]}>{item.category}</Text>
                                <Text style={[styles.tableCol, styles.col4]}>
                                    ৳{item.amount.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Transactions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Transactions ({data.transactions.length})
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCol, styles.col1]}>Date</Text>
                        <Text style={[styles.tableCol, styles.col2]}>Type</Text>
                        <Text style={[styles.tableCol, styles.col3]}>Category</Text>
                        <Text style={[styles.tableCol, styles.col4]}>Amount</Text>
                        <Text style={[styles.tableCol, styles.col5]}>Note</Text>
                    </View>
                    {data.transactions.slice(0, 50).map((txn, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.col1]}>
                                {new Date(txn.date).toLocaleDateString()}
                            </Text>
                            <Text style={[styles.tableCol, styles.col2]}>{txn.type}</Text>
                            <Text style={[styles.tableCol, styles.col3]}>{txn.category}</Text>
                            <Text style={[styles.tableCol, styles.col4]}>
                                ৳{txn.amount.toFixed(2)}
                            </Text>
                            <Text style={[styles.tableCol, styles.col5]}>
                                {txn.note.substring(0, 20)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Generated on {new Date().toLocaleDateString()} - Finance App (BDT)
            </Text>
        </Page>
    </Document>
);

