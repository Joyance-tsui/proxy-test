export async function onRequest(context) {
    const { TURNSTILE_SECRET_KEY, HIDDEN_CONTENT } = context.env;
    
    // 从请求体获取 token
    const { token } = await context.request.json();

    // 验证 Turnstile token
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${TURNSTILE_SECRET_KEY}&response=${token}`
    });

    const verifyResult = await verifyResponse.json();

    if (verifyResult.success) {
        // 验证成功，返回隐藏内容
        return new Response(JSON.stringify({ success: true, hiddenContent: HIDDEN_CONTENT }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        // 验证失败
        return new Response(JSON.stringify({ success: false }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
