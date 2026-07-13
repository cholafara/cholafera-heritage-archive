$files = Get-ChildItem -Path . -Recurse -Filter *.html | Where-Object { -not $_.PSIsContainer }
$changed = New-Object System.Collections.Generic.List[string]
foreach ($file in $files) {
    $path = $file.FullName
    $content = [System.IO.File]::ReadAllText($path, [System.Text.UTF8Encoding]::new($false))
    $original = $content

    $content = $content -replace 'Â©', '&copy;'
    $content = $content -replace 'Ã‚Â©', '&copy;'
    $content = $content -replace '🔍', '<i class="fa-solid fa-magnifying-glass"></i>'
    $content = $content -replace '🌙', '<i class="fa-regular fa-moon"></i>'
    $content = $content -replace '▾', '<i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>'
    $content = $content -replace 'â–¾', '<i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>'
    $content = $content -replace 'ðŸ”�', '<i class="fa-solid fa-magnifying-glass"></i>'
    $content = $content -replace 'ðŸŒ™', '<i class="fa-regular fa-moon"></i>'
    $content = [regex]::Replace($content, '<p[^>]*class=["'']section-subtitle["''][^>]*>.*?DEVELOPING LIVE.*?</p>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($content -notmatch 'cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css') {
        $content = $content -replace '</head>', '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">`n</head>'
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
        $changed.Add($file.FullName)
    }
}
Write-Host "CHANGED_FILES $($changed.Count)"
foreach ($p in $changed) { Write-Host $p }
