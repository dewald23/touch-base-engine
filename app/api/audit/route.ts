import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/supabase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { businessName, location, industry, currentTech, phone } = await req.json();

    if (!businessName || !location || !phone) {
      return NextResponse.json({ error: 'Missing required business parameters.' }, { status: 400 });
    }

    const prompt = `You are a Principal Digital Growth Strategist for Touch Base Consulting in the Overberg, South Africa. 
    Analyze this local business:
    - Business: ${businessName}
    - Location: ${location}
    - Industry: ${industry}
    - Current Tech: ${currentTech}

    Calculate an estimated monthly revenue loss due to slow mobile loading speeds and missed Google Map Pack rankings. 
    Provide a concise, punchy 2-sentence executive summary highlighting their exact speed and ranking vulnerability in the Overberg market.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiAnalysis = response.text || 'High mobile latency detected on legacy infrastructure.';

    const { data: leadData, error: dbError } = await supabase
      .from('audit_leads')
      .insert([
        { business_name: businessName, location, industry, current_tech: currentTech, phone, ai_analysis: aiAnalysis }
      ])
      .select();

    if (dbError) {
      console.error('Supabase Error:', dbError.message);
    }

    const businessWhatsAppNumber = '27820000000'; // Update with your actual WhatsApp number
    const waMessage = encodeURIComponent(
      `Hi Touch Base team, I ran the audit for ${businessName} in ${location}. Let's discuss upgrading our edge performance.`
    );
    const whatsappLink = `https://wa.me/${businessBusinessWhatsAppNumber = businessWhatsAppNumber}?text=${waMessage}`;

    return NextResponse.json({
      success: true,
      analysis: aiAnalysis,
      whatsappLink,
      leadId: leadData?.[0]?.id || null,
    });

  } catch (err: any) {
    console.error('Audit API Error:', err);
    return NextResponse.json({ error: 'Internal server error processing audit.' }, { status: 500 });
  }
}
