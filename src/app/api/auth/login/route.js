import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

export async function POST(request) {
    try {
        const body = await request.json();
        
        console.log('Request body:', body);

        // Pastikan nik dan password tidak kosong
        if (!body.username || !body.password) {
            return NextResponse.json({
                success: false,
                message: 'NIK dan password harus diisi',
                error: 'NIK dan password harus diisi'
            }, { status: 400 });
        }

        // Format request body sesuai dengan yang diharapkan API
        const requestBody = {
            nik: body.username,
            password: body.password
        };

        console.log('Sending to API:', requestBody);

        // Forward request ke backend API
        const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Backend response status:', response.status);
        
        const responseText = await response.text();
        console.log('Backend response text:', responseText);

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing response:', error);
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Format response tidak valid',
                    error: 'Format response tidak valid'
                },
                { status: 500 }
            );
        }

        // Jika login gagal
        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: responseData.message || 'Login gagal',
                error: responseData.message || 'Login gagal'
            }, {
                status: response.status
            });
        }

        // Jika login berhasil
        return NextResponse.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token: responseData.data || responseData.data?.data,
                user: responseData.data || {}
            }
        }, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Terjadi kesalahan saat login',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
} 