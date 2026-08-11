Add-Type -AssemblyName System.Drawing

function New-AppIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [double]$Padding = 0.14
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    # Background: rounded square, brand blue (categorical slot 1 from dataviz palette)
    $bg = [System.Drawing.Color]::FromArgb(255, 0x25, 0x6a, 0xbf)
    $bgBrush = New-Object System.Drawing.SolidBrush($bg)
    $radius = [double]$Size * 0.22
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
    $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)

    # Foreground: white pulse / cardiogram line representing health data
    $pad = [double]$Size * $Padding
    $midY = $Size * 0.55
    $penWidth = [Math]::Max(2, $Size * 0.055)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $penWidth)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $x0 = $pad
    $x1 = $Size * 0.32
    $x2 = $Size * 0.40
    $x3 = $Size * 0.50
    $x4 = $Size * 0.58
    $x5 = $Size * 0.68
    $x6 = $Size - $pad

    $points = @(
        (New-Object System.Drawing.PointF($x0, $midY)),
        (New-Object System.Drawing.PointF($x1, $midY)),
        (New-Object System.Drawing.PointF($x2, $Size * 0.30)),
        (New-Object System.Drawing.PointF($x3, $Size * 0.78)),
        (New-Object System.Drawing.PointF($x4, $Size * 0.40)),
        (New-Object System.Drawing.PointF($x5, $midY)),
        (New-Object System.Drawing.PointF($x6, $midY))
    )
    $g.DrawLines($pen, $points)

    $dotR = [Math]::Max(2, $Size * 0.035)
    $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($dotBrush, $x0 - $dotR, $midY - $dotR, $dotR * 2, $dotR * 2)
    $g.FillEllipse($dotBrush, $x6 - $dotR, $midY - $dotR, $dotR * 2, $dotR * 2)

    $dir = Split-Path $OutPath -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $pen.Dispose(); $dotBrush.Dispose(); $bgBrush.Dispose(); $path.Dispose(); $g.Dispose(); $bmp.Dispose()
}

$root = Split-Path $PSScriptRoot -Parent

New-AppIcon -Size 48  -OutPath (Join-Path $root "src\app\icon.png")
New-AppIcon -Size 180 -OutPath (Join-Path $root "src\app\apple-icon.png") -Padding 0.20
New-AppIcon -Size 192 -OutPath (Join-Path $root "public\icons\icon-192.png")
New-AppIcon -Size 512 -OutPath (Join-Path $root "public\icons\icon-512.png")
New-AppIcon -Size 512 -OutPath (Join-Path $root "public\icons\icon-512-maskable.png") -Padding 0.24

Write-Host "Icons generated."
