import torch
import torchvision.transforms as transforms
from torchvision import models
import torch.nn.functional as F

# Load pretrained model (simple baseline)
model = models.resnet18(pretrained=True)
model.fc = torch.nn.Linear(model.fc.in_features, 2)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def predict_image(image):
    img_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(img_tensor)
        probs = F.softmax(output, dim=1)

    fake_prob = probs[0][1].item()
    return fake_prob
