export function submitViaHiddenForm(actionUrl: string, fields: Record<string, string>) {
  // Tạo form thật
  const form = document.createElement('form');
  form.action = actionUrl;
  form.method = 'POST';
  form.target = 'gform_iframe';
  form.style.display = 'none';

  Object.entries(fields).forEach(([k, v]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = k;
    input.value = v ?? '';
    form.appendChild(input);
  });

  // "submit=Submit" bắt chước hành vi Google Forms
  const submitInput = document.createElement('input');
  submitInput.type = 'hidden';
  submitInput.name = 'submit';
  submitInput.value = 'Submit';
  form.appendChild(submitInput);

  // Iframe ẩn nhận kết quả
  let iframe = document.getElementById('gform_iframe') as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'gform_iframe';
    iframe.id = 'gform_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  document.body.appendChild(form);
  form.submit();

  // Dọn dẹp sau 1 nhịp
  setTimeout(() => form.remove(), 0);
}
